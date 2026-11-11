import * as React from 'react';
import clsx from 'clsx';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface MenuDividerProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'menu-divider'
   */
  bsPrefix?: string | undefined;

  /**
   * An ARIA accessible role.
   */
  role?: string | undefined;
}

const MenuDivider: DynamicRefForwardingComponent<'hr', MenuDividerProps> =
  React.forwardRef<HTMLElement, MenuDividerProps>(
    (
      {
        className,
        bsPrefix,
        as: Component = 'hr',
        role = 'separator',
        ...props
      },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'menu-divider');
      return (
        <Component
          ref={ref}
          className={clsx(className, bsPrefix)}
          role={role}
          {...props}
        />
      );
    },
  );

MenuDivider.displayName = 'MenuDivider';

export default MenuDivider;
