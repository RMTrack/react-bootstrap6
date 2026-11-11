import * as React from 'react';
import clsx from 'clsx';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface MenuHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'menu-header'
   */
  bsPrefix?: string | undefined;

  /**
   * An ARIA accessible role.
   */
  role?: string | undefined;
}

const MenuHeader: DynamicRefForwardingComponent<'div', MenuHeaderProps> =
  React.forwardRef<HTMLElement, MenuHeaderProps>(
    (
      {
        className,
        bsPrefix,
        as: Component = 'div',
        role = 'heading',
        ...props
      },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'menu-header');
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

MenuHeader.displayName = 'MenuHeader';

export default MenuHeader;
