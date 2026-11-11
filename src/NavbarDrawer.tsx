import * as React from 'react';
import { useContext } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';
import Drawer, { type DrawerProps } from './Drawer.js';
import NavbarContext from './NavbarContext.js';

export type NavbarDrawerProps = Omit<DrawerProps, 'show'>;

const NavbarDrawer = React.forwardRef<HTMLDialogElement, NavbarDrawerProps>(
  ({ onHide, ...props }, ref) => {
    const context = useContext(NavbarContext);

    const handleHide = useEventCallback(() => {
      context?.onToggle?.();
      onHide?.();
    });

    return (
      <Drawer
        ref={ref}
        show={!!context?.expanded}
        {...props}
        onHide={handleHide}
      />
    );
  },
);

NavbarDrawer.displayName = 'NavbarDrawer';

export default NavbarDrawer;
