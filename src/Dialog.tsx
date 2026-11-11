import clsx from 'clsx';
import * as React from 'react';
import { useMemo } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';
import DialogBase from './DialogBase.js';
import DialogBody from './DialogBody.js';
import DialogContext from './DialogContext.js';
import DialogFooter from './DialogFooter.js';
import DialogHeader from './DialogHeader.js';
import DialogTitle from './DialogTitle.js';
import { useBootstrapPrefix } from './ThemeProvider.js';
import type { BaseDialogProps, LiteralUnion } from './types.js';

export interface DialogProps
  extends
    BaseDialogProps,
    Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open'> {
  /**
   * @default 'dialog'
   */
  bsPrefix?: string | undefined;

  /**
   * Render a large, extra large or small modal.
   * When not provided, the modal is rendered with medium (default) size.
   */
  size?: 'sm' | 'lg' | 'xl' | undefined;

  /**
   * Renders a fullscreen modal. Specifying a breakpoint will render the modal
   * as fullscreen __below__ the breakpoint size.
   */
  fullscreen?:
    | true
    | LiteralUnion<
        'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | '2xl-down',
        string
      >
    | undefined;

  /**
   * Open and close the Dialog with a fade animation. When `false` the modal
   * gets `.dialog-instant` and opens and closes instantly.
   */
  animation?: boolean | undefined;

  /**
   * Allows scrolling the `<Dialog.Body>` instead of the entire Dialog when overflowing.
   */
  scrollable?: boolean | undefined;

  /**
   * Open as a modal dialog (`showModal()`), with a backdrop, focus trapping
   * and an inert page. When `false` the dialog is opened with `show()`: no
   * backdrop, and the rest of the page stays interactive.
   */
  modal?: boolean | undefined;
}

const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(
  (
    {
      bsPrefix,
      className,
      size,
      fullscreen,
      scrollable,
      children,
      show = false,
      animation = true,
      backdrop = true,
      keyboard = true,
      modal = true,
      onHide,
      ...props
    },
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'dialog');
    const handleHide = useEventCallback(onHide);

    const modalContext = useMemo(
      () => ({
        onHide: handleHide,
      }),
      [handleHide],
    );

    const fullscreenClass =
      typeof fullscreen === 'string'
        ? `${fullscreen}:${bsPrefix}-fullscreen`
        : `${bsPrefix}-fullscreen`;

    return (
      <DialogContext.Provider value={modalContext}>
        <DialogBase
          ref={ref}
          {...props}
          show={show}
          modal={modal}
          animation={animation}
          backdrop={backdrop}
          keyboard={keyboard}
          onHide={onHide}
          instantClassName={`${bsPrefix}-instant`}
          staticClassName={`${bsPrefix}-static`}
          nonModalClassName={`${bsPrefix}-nonmodal`}
          className={clsx(
            className,
            bsPrefix,
            size && `${bsPrefix}-${size}`,
            fullscreen && fullscreenClass,
            scrollable && `${bsPrefix}-scrollable`,
          )}
        >
          {children}
        </DialogBase>
      </DialogContext.Provider>
    );
  },
);

Dialog.displayName = 'Dialog';

export default Object.assign(Dialog, {
  Body: DialogBody,
  Header: DialogHeader,
  Title: DialogTitle,
  Footer: DialogFooter,
});
