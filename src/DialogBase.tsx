import clsx from 'clsx';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import useEventCallback from '@restart/hooks/useEventCallback';
import useIsomorphicEffect from '@restart/hooks/useIsomorphicEffect';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import useWaitForDOMRef from '@restart/ui/useWaitForDOMRef';
import ownerDocument from 'dom-helpers/ownerDocument';
import { parseDuration } from './transitionEndListener.js';
import triggerBrowserReflow from './triggerBrowserReflow.js';
import type { DOMContainer, TransitionCallbacks } from './types.js';

/**
 * Shared implementation for components built on the native `<dialog>`
 * element (Dialog and Drawer). Mirrors Bootstrap 6's `dialog-base.ts`:
 *
 * - opens with `showModal()` (or `show()` for non-modal dialogs)
 * - the backdrop is the native `::backdrop`, focus trapping and the inert
 *   page come from the browser's top layer
 * - closing adds `.hiding` so the CSS exit transition can play, then calls
 *   `close()`
 * - page scroll is locked with `.dialog-open` on the root `<html>` element
 */

type DialogStatus = 'exited' | 'mounting' | 'entering' | 'entered' | 'exiting';

const CLASS_NAME_OPEN = 'dialog-open';
const CLASS_NAME_HIDING = 'hiding';

interface OpenDialog {
  dialog: HTMLDialogElement;
  modal: boolean;
  lockScroll: boolean;
}

// Dialogs opened by this module, in the order they were opened. Used to find
// the topmost modal dialog for Escape handling and to decide when the page
// scroll lock can be released.
const openDialogs: OpenDialog[] = [];

function isTopModalDialog(dialog: HTMLDialogElement) {
  const modals = openDialogs.filter((d) => d.modal);
  return modals[modals.length - 1]?.dialog === dialog;
}

function isAnyModalOpen(doc: Document) {
  try {
    return !!doc.querySelector('dialog[open]:modal');
  } catch {
    // `:modal` is unsupported, fall back to the dialogs we know about.
    return false;
  }
}

function isEscapeKey(e: KeyboardEvent) {
  return e.key === 'Escape' || e.keyCode === 27;
}

/**
 * Waits for the element's own `transitionend`, with a timeout based on the
 * computed transition duration as a fallback for transitions that never run
 * (no CSS loaded, `prefers-reduced-motion`, a hidden tab).
 */
function waitForTransition(
  element: HTMLElement,
  animated: boolean,
  callback: () => void,
): (() => void) | undefined {
  if (!animated) {
    callback();
    return undefined;
  }

  const duration =
    parseDuration(element, 'transition-duration') +
    parseDuration(element, 'transition-delay');

  let done = false;
  const cleanup = () => {
    done = true;
    clearTimeout(timer);
    element.removeEventListener('transitionend', handleTransitionEnd);
  };
  const finish = () => {
    if (done) return;
    cleanup();
    callback();
  };
  function handleTransitionEnd(e: TransitionEvent) {
    if (e.target === element) finish();
  }

  element.addEventListener('transitionend', handleTransitionEnd);
  const timer = setTimeout(finish, (duration || 0) + 5);

  return cleanup;
}

export interface DialogBaseProps
  extends
    TransitionCallbacks,
    Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open'> {
  show?: boolean | undefined;

  /**
   * `true` opens the dialog with `showModal()` (top layer, backdrop, inert
   * page). `false` opens it with `show()`.
   */
  modal?: boolean | undefined;

  /**
   * Lock page scrolling while open. Defaults to `modal`.
   */
  preventBodyScroll?: boolean | undefined;

  animation?: boolean | undefined;

  backdrop?: boolean | 'static' | undefined;

  keyboard?: boolean | undefined;

  container?: DOMContainer | undefined;

  onShow?: (() => void) | undefined;

  onHide?: (() => void) | undefined;

  onEscapeKeyDown?: ((e: KeyboardEvent) => void) | undefined;

  /**
   * Keep the dialog in the top layer (delay `close()`) until the exit
   * transition ends. Bootstrap's Dialog does this so the centered position and
   * the `::backdrop` survive the exit animation; Drawer does not.
   */
  deferClose?: boolean | undefined;

  /**
   * Render the dialog into `container` (`document.body` by default). When
   * `false` it renders in place.
   */
  portal?: boolean | undefined;

  /**
   * Keep the closed `<dialog>` and its children mounted. Needed for drawers
   * that a navbar or a responsive breakpoint shows inline while closed.
   */
  keepMounted?: boolean | undefined;

  /** Class added when `animation` is `false`, e.g. `dialog-instant`. */
  instantClassName: string;

  /** Class added for the static backdrop "bounce", e.g. `dialog-static`. */
  staticClassName: string;

  /** Class added when `modal` is `false`, e.g. `dialog-nonmodal`. */
  nonModalClassName?: string | undefined;
}

const DialogBase = React.forwardRef<HTMLDialogElement, DialogBaseProps>(
  (
    {
      show = false,
      modal = true,
      preventBodyScroll,
      animation = true,
      backdrop = true,
      keyboard = true,
      container,
      deferClose = true,
      portal = true,
      keepMounted = false,
      instantClassName,
      staticClassName,
      nonModalClassName,
      className,
      children,
      onShow,
      onHide,
      onEscapeKeyDown,
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      onExited,
      onClick,
      onMouseDown,
      onMouseUp,
      onCancel,
      onClose,
      ...props
    },
    ref,
  ) => {
    const lockScroll = preventBodyScroll ?? modal;

    const [status, setStatus] = useState<DialogStatus>(
      show ? 'mounting' : 'exited',
    );
    const [isStatic, setIsStatic] = useState(false);

    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const mergedRef = useMergedRefs<HTMLDialogElement>(
      ref as any,
      dialogRef as any,
    );
    const openedRef = useRef<HTMLDialogElement | null>(null);
    const internalCloseRef = useRef(false);
    const waitingForMouseUpRef = useRef(false);
    const ignoreBackdropClickRef = useRef(false);

    const mountNode = useWaitForDOMRef(container);

    // Derive the lifecycle status from `show`.
    let nextStatus = status;
    if (show) {
      if (status === 'exited') nextStatus = 'mounting';
      else if (status === 'exiting') nextStatus = 'entering';
    } else if (status === 'mounting') {
      nextStatus = 'exited';
    } else if (status === 'entering' || status === 'entered') {
      nextStatus = 'exiting';
    }
    if (nextStatus !== status) {
      setStatus(nextStatus);
    }

    const release = useEventCallback((dialog: HTMLDialogElement) => {
      const idx = openDialogs.findIndex((d) => d.dialog === dialog);
      if (idx !== -1) openDialogs.splice(idx, 1);
      if (openedRef.current === dialog) openedRef.current = null;

      const doc = ownerDocument(dialog);
      if (!openDialogs.some((d) => d.lockScroll) && !isAnyModalOpen(doc)) {
        doc.documentElement.classList.remove(CLASS_NAME_OPEN);
      }
    });

    const openDialog = useEventCallback((dialog: HTMLDialogElement) => {
      internalCloseRef.current = false;
      if (!dialog.open) {
        if (modal) dialog.showModal();
        else dialog.show();
      }

      if (!openDialogs.some((d) => d.dialog === dialog)) {
        openDialogs.push({ dialog, modal, lockScroll });
      }
      openedRef.current = dialog;

      if (lockScroll) {
        ownerDocument(dialog).documentElement.classList.add(CLASS_NAME_OPEN);
      }
    });

    const closeDialog = useEventCallback((dialog: HTMLDialogElement) => {
      if (dialog.open) {
        internalCloseRef.current = true;
        dialog.close();
      }
      release(dialog);
    });

    const runMount = useEventCallback((dialog: HTMLDialogElement) => {
      // Flush styles so the closed state is the transition's starting point.
      triggerBrowserReflow(dialog);
      onEnter?.(dialog, true);
      openDialog(dialog);
      onShow?.();
      setStatus('entering');
    });

    const runEnter = useEventCallback((dialog: HTMLDialogElement) => {
      // Shown again mid-exit after the dialog was already closed.
      if (!dialog.open) openDialog(dialog);
      onEntering?.(dialog, true);
      return waitForTransition(dialog, animation, () => {
        setStatus('entered');
        onEntered?.(dialog, true);
      });
    });

    const runExit = useEventCallback((dialog: HTMLDialogElement) => {
      onExit?.(dialog);
      if (!deferClose || !animation) {
        closeDialog(dialog);
      }
      onExiting?.(dialog);
      return waitForTransition(dialog, animation, () => {
        closeDialog(dialog);
        setStatus('exited');
        onExited?.(dialog);
      });
    });

    useIsomorphicEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return undefined;

      if (status === 'mounting') {
        runMount(dialog);
      } else if (status === 'entering') {
        return runEnter(dialog);
      } else if (status === 'exiting') {
        return runExit(dialog);
      }
      return undefined;
    }, [status, mountNode, runMount, runEnter, runExit]);

    // Close the dialog if the component unmounts while it is open.
    useIsomorphicEffect(
      () => () => {
        if (openedRef.current) closeDialog(openedRef.current);
      },
      [closeDialog],
    );

    const triggerStaticAnimation = useEventCallback(() => {
      setIsStatic(true);
    });

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!isStatic || !dialog) return undefined;
      return waitForTransition(dialog, true, () => setIsStatic(false));
    }, [isStatic]);

    const handleEscape = useEventCallback((e: KeyboardEvent) => {
      if (!keyboard) {
        // Cancelling the keydown also cancels the native close request.
        e.preventDefault();
        if (modal) triggerStaticAnimation();
        return;
      }

      onEscapeKeyDown?.(e);
      const cancelled = e.defaultPrevented;
      e.preventDefault();
      if (!cancelled) onHide?.();
    });

    const isOpen = status === 'entering' || status === 'entered';

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!isOpen || !dialog) return undefined;

      const doc = ownerDocument(dialog);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.defaultPrevented || !isEscapeKey(e)) return;
        const owns = modal
          ? isTopModalDialog(dialog)
          : dialog.contains(e.target as Node);
        if (owns) handleEscape(e);
      };

      doc.addEventListener('keydown', handleKeyDown);
      return () => doc.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, modal, handleEscape]);

    // A click on the native ::backdrop is dispatched to the <dialog> itself,
    // outside of its border box.
    const isBackdropEvent = (e: React.MouseEvent<HTMLDialogElement>) => {
      const dialog = dialogRef.current;
      if (!dialog || e.target !== dialog) return false;
      const rect = dialog.getBoundingClientRect();
      return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
    };

    // Don't close the dialog when a drag starts inside it and ends on the
    // backdrop (e.g. selecting text).
    const handleMouseDown = (e: React.MouseEvent<HTMLDialogElement>) => {
      onMouseDown?.(e);
      waitingForMouseUpRef.current = !isBackdropEvent(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDialogElement>) => {
      onMouseUp?.(e);
      if (waitingForMouseUpRef.current && isBackdropEvent(e)) {
        ignoreBackdropClickRef.current = true;
      }
      waitingForMouseUpRef.current = false;
    };

    const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      onClick?.(e);

      const ignore = ignoreBackdropClickRef.current;
      ignoreBackdropClickRef.current = false;
      if (ignore || !modal || !isBackdropEvent(e)) return;

      if (backdrop === 'static') {
        triggerStaticAnimation();
      } else if (backdrop) {
        onHide?.();
      }
    };

    // Close requests that don't come from a keydown we handled (e.g. the
    // Android back gesture).
    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
      onCancel?.(e);
      e.preventDefault();

      if (!keyboard) {
        triggerStaticAnimation();
      } else {
        onHide?.();
      }
    };

    // The dialog was closed natively, e.g. by a `<form method="dialog">`, a
    // `command="close"` invoker, or the browser overriding a cancelled close
    // request. Release it and ask the parent to update `show`.
    const handleClose = (e: React.SyntheticEvent<HTMLDialogElement>) => {
      onClose?.(e);

      if (internalCloseRef.current) {
        internalCloseRef.current = false;
        return;
      }

      release(e.currentTarget);
      if (show) onHide?.();
    };

    if ((status === 'exited' && !keepMounted) || (portal && !mountNode)) {
      return null;
    }

    const dialog = (
      <dialog
        ref={mergedRef}
        {...props}
        className={clsx(
          className,
          !animation && instantClassName,
          !modal && nonModalClassName,
          isStatic && staticClassName,
          status === 'exiting' && CLASS_NAME_HIDING,
        )}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onCancel={handleCancel}
        onClose={handleClose}
      >
        {
          // Children mount once the dialog is open so React's `autoFocus` (which
          // calls focus() on mount) can focus elements inside it.
          (keepMounted || status !== 'mounting') && children
        }
      </dialog>
    );

    return portal ? ReactDOM.createPortal(dialog, mountNode!) : dialog;
  },
);

DialogBase.displayName = 'DialogBase';

export default DialogBase;
