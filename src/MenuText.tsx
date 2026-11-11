import * as React from 'react';
import clsx from 'clsx';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface MenuTextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'menu-text'
   */
  bsPrefix?: string | undefined;
}

const MenuText: DynamicRefForwardingComponent<'span', MenuTextProps> =
  React.forwardRef<HTMLElement, MenuTextProps>(
    ({ className, bsPrefix, as: Component = 'span', ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'menu-text');
      return (
        <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
      );
    },
  );

MenuText.displayName = 'MenuText';

export default MenuText;
