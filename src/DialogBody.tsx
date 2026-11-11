import * as React from 'react';
import clsx from 'clsx';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface DialogBodyProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'dialog-body'
   */
  bsPrefix?: string | undefined;
}

const DialogBody: DynamicRefForwardingComponent<'div', DialogBodyProps> =
  React.forwardRef<HTMLElement, DialogBodyProps>(
    ({ className, bsPrefix, as: Component = 'div', ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'dialog-body');
      return (
        <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
      );
    },
  );

DialogBody.displayName = 'DialogBody';

export default DialogBody;
