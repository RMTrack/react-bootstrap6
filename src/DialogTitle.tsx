import * as React from 'react';
import clsx from 'clsx';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface DialogTitleProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'dialog-title'
   */
  bsPrefix?: string | undefined;
}

const DialogTitle: DynamicRefForwardingComponent<'h5', DialogTitleProps> =
  React.forwardRef<HTMLElement, DialogTitleProps>(
    ({ className, bsPrefix, as: Component = 'h5', ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'dialog-title');
      return (
        <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
      );
    },
  );

DialogTitle.displayName = 'DialogTitle';

export default DialogTitle;
