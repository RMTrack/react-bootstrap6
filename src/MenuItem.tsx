import clsx from 'clsx';
import * as React from 'react';
import { useDropdownItem } from '@restart/ui/DropdownItem';
import Anchor from '@restart/ui/Anchor';
import type {
  DynamicRefForwardingComponent,
  EventKey,
} from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface MenuItemProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'menu-item'
   */
  bsPrefix?: string | undefined;

  /**
   * Highlight the menu item as active.
   */
  active?: boolean | undefined;

  /**
   * Disable the menu item, making it unselectable.
   */
  disabled?: boolean | undefined;

  /**
   * Value passed to the `onSelect` handler, useful for identifying the selected menu item.
   */
  eventKey?: EventKey | undefined;

  /**
   * HTML `href` attribute corresponding to `a.href`.
   */
  href?: string | undefined;
}

const MenuItem: DynamicRefForwardingComponent<'a', MenuItemProps> =
  React.forwardRef<HTMLElement, MenuItemProps>(
    (
      {
        bsPrefix,
        className,
        eventKey,
        disabled = false,
        onClick,
        active,
        as: Component = Anchor,
        ...props
      },
      ref,
    ) => {
      const prefix = useBootstrapPrefix(bsPrefix, 'menu-item');
      const [dropdownItemProps, meta] = useDropdownItem({
        key: eventKey,
        href: props.href,
        disabled,
        onClick,
        active,
      });

      return (
        <Component
          {...props}
          {...dropdownItemProps}
          ref={ref}
          className={clsx(
            className,
            prefix,
            meta.isActive && 'active',
            disabled && 'disabled',
          )}
        />
      );
    },
  );

MenuItem.displayName = 'MenuItem';

export default MenuItem;
