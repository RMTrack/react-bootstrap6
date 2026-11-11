import * as React from 'react';
import clsx from 'clsx';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface DialogFooterProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'dialog-footer'
   */
  bsPrefix?: string | undefined;
}

const DialogFooter: DynamicRefForwardingComponent<'div', DialogFooterProps> =
  React.forwardRef<HTMLElement, DialogFooterProps>(
    ({ className, bsPrefix, as: Component = 'div', ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'dialog-footer');
      return (
        <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
      );
    },
  );

DialogFooter.displayName = 'DialogFooter';

export default DialogFooter;
