import * as React from 'react';
import clsx from 'clsx';
import { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'drawer-body'
   */
  bsPrefix?: string | undefined;
}

const DrawerBody: DynamicRefForwardingComponent<'div', DrawerBodyProps> =
  React.forwardRef<HTMLElement, DrawerBodyProps>(
    ({ className, bsPrefix, as: Component = 'div', ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'drawer-body');
      return (
        <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
      );
    },
  );

DrawerBody.displayName = 'DrawerBody';

export default DrawerBody;
