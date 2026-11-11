import useMergedRefs from '@restart/hooks/useMergedRefs';
import BaseMenuContext from '@restart/ui/DropdownContext';
import { useDropdownToggle } from '@restart/ui/DropdownToggle';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import clsx from 'clsx';
import * as React from 'react';
import { useContext } from 'react';
import Button, { type ButtonProps, type CommonButtonProps } from './Button.js';
import MenuContext from './MenuContext.js';
import { useBootstrapPrefix } from './ThemeProvider.js';
import useWrappedRefWithWarning from './useWrappedRefWithWarning.js';

export interface MenuToggleProps extends Omit<ButtonProps, 'as'> {
  /**
   * Element used to render the component.
   *
   * @default {Button}
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'menu-toggle'
   */
  bsPrefix?: string | undefined;

  /**
   * Renders a split button menu toggle.
   */
  split?: boolean | undefined;

  /**
   * To passthrough to the underlying button or whatever from MenuButton
   * @private
   * @internal
   */
  childBsPrefix?: string | undefined;
}

type MenuToggleComponent = DynamicRefForwardingComponent<
  'button',
  MenuToggleProps
>;

export type PropsFromToggle = Partial<
  Pick<React.ComponentPropsWithRef<MenuToggleComponent>, CommonButtonProps>
>;

const MenuToggle: MenuToggleComponent = React.forwardRef(
  (
    {
      bsPrefix,
      split,
      className,
      childBsPrefix,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = Button,
      ...props
    }: MenuToggleProps,
    ref,
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, 'menu-toggle');
    const baseMenuContext = useContext(BaseMenuContext);
    const { toggleRef } = useContext(MenuContext);

    if (childBsPrefix !== undefined) {
      (props as any).bsPrefix = childBsPrefix;
    }

    const [toggleProps] = useDropdownToggle();

    toggleProps.ref = useMergedRefs(
      useMergedRefs(toggleProps.ref, toggleRef as any),
      useWrappedRefWithWarning(ref, 'MenuToggle'),
    );

    // This intentionally forwards size and variant (if set) to the
    // underlying component, to allow it to render size and style variants.
    return (
      <Component
        // Bootstrap 6 menu toggles need no class; split toggles get
        // `.menu-toggle-split`.
        className={clsx(
          className,
          split && `${prefix}-split`,
          baseMenuContext?.show && 'show',
        )}
        {...toggleProps}
        {...props}
      />
    );
  },
);

MenuToggle.displayName = 'MenuToggle';

export default MenuToggle;
