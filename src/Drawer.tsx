import clsx from 'clsx';
import useDebouncedCallback from '@restart/hooks/useDebouncedCallback';
import useEventCallback from '@restart/hooks/useEventCallback';
import useEventListener from '@restart/hooks/useEventListener';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import * as React from 'react';
import { useCallback, useMemo, useRef } from 'react';
import DialogBase from './DialogBase.js';
import DialogContext from './DialogContext.js';
import DrawerBody from './DrawerBody.js';
import DrawerHeader from './DrawerHeader.js';
import DrawerTitle from './DrawerTitle.js';
import { toBreakpointName, useBootstrapPrefix } from './ThemeProvider.js';
import type { BaseDialogProps, LiteralUnion } from './types.js';

export type DrawerPlacement = 'start' | 'end' | 'top' | 'bottom';

export interface DrawerProps
  extends
    Omit<BaseDialogProps, 'container'>,
    Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open'> {
  /**
   * @default 'drawer'
   */
  bsPrefix?: string | undefined;

  /**
   * Allow body scrolling while the drawer is open. Combined with
   * `backdrop={false}` the drawer opens as a non-modal dialog.
   */
  scroll?: boolean | undefined;

  /**
   * Which side of the viewport the drawer will appear from.
   */
  placement?: DrawerPlacement | undefined;

  /**
   * Show the drawer inline from the specified breakpoint and up
   * (`.md:drawer`); below it, it behaves as a regular drawer.
   */
  responsive?:
    LiteralUnion<'sm' | 'md' | 'lg' | 'xl' | '2xl', string> | undefined;

  /**
   * Open and close the drawer with a slide animation. When `false` the drawer
   * gets `.drawer-instant`.
   */
  animation?: boolean | undefined;
}

/**
 * Bootstrap 6's Drawer (Offcanvas in Bootstrap 5), built on the native `<dialog>`
 * element. It renders in place (no portal) and stays mounted while closed, so
 * responsive and navbar drawers can be shown inline.
 */
const Drawer = React.forwardRef<HTMLDialogElement, DrawerProps>(
  (
    {
      bsPrefix,
      className,
      children,
      placement = 'start',
      responsive,
      show = false,
      backdrop = true,
      keyboard = true,
      scroll = false,
      animation = true,
      onHide,
      ...props
    },
    ref,
  ) => {
    const drawerRef = useRef<HTMLDialogElement | null>(null);
    const mergedRef = useMergedRefs<HTMLDialogElement>(
      ref as any,
      drawerRef as any,
    );
    bsPrefix = useBootstrapPrefix(bsPrefix, 'drawer');
    const handleHide = useEventCallback(onHide);

    // A drawer that is laid out inline (a responsive drawer above its
    // breakpoint, or a drawer in an expanded navbar) is no longer `fixed`;
    // close it if it was open when the viewport crossed the breakpoint.
    const debouncedResizeHandler = useDebouncedCallback(() => {
      if (
        show &&
        drawerRef.current &&
        getComputedStyle(drawerRef.current).position !== 'fixed'
      ) {
        handleHide();
      }
    }, 300);

    const getWindowTarget = useCallback(() => window, []);

    useEventListener(getWindowTarget, 'resize', debouncedResizeHandler);

    const modalContext = useMemo(
      () => ({
        onHide: handleHide,
      }),
      [handleHide],
    );

    return (
      <DialogContext.Provider value={modalContext}>
        <DialogBase
          ref={mergedRef}
          {...props}
          show={show}
          // Like Bootstrap's Drawer: modal unless the page may scroll and
          // there is no backdrop.
          modal={!!backdrop || !scroll}
          preventBodyScroll={!scroll}
          backdrop={backdrop}
          keyboard={keyboard}
          animation={animation}
          onHide={onHide}
          portal={false}
          keepMounted
          deferClose={false}
          instantClassName={`${bsPrefix}-instant`}
          staticClassName={`${bsPrefix}-static`}
          className={clsx(
            className,
            responsive
              ? `${toBreakpointName(responsive)}:${bsPrefix}`
              : bsPrefix,
            `${bsPrefix}-${placement}`,
          )}
        >
          {children}
        </DialogBase>
      </DialogContext.Provider>
    );
  },
);

Drawer.displayName = 'Drawer';

export default Object.assign(Drawer, {
  Body: DrawerBody,
  Header: DrawerHeader,
  Title: DrawerTitle,
});
