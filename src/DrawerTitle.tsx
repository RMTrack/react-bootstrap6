import * as React from 'react';
import clsx from 'clsx';
import { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'drawer-title'
   */
  bsPrefix?: string | undefined;
}

const DrawerTitle: DynamicRefForwardingComponent<'div', DrawerTitleProps> =
  React.forwardRef<HTMLElement, DrawerTitleProps>(
    ({ className, bsPrefix, as: Component = 'h5', ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'drawer-title');
      return (
        <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
      );
    },
  );

DrawerTitle.displayName = 'DrawerTitle';

export default DrawerTitle;
