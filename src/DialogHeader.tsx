import clsx from 'clsx';
import * as React from 'react';
import { useBootstrapPrefix } from './ThemeProvider.js';
import AbstractDialogHeader, {
  type AbstractDialogHeaderProps,
} from './AbstractDialogHeader.js';

export interface DialogHeaderProps extends AbstractDialogHeaderProps {
  /**
   * @default 'dialog-header'
   */
  bsPrefix?: string | undefined;
}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  (
    {
      bsPrefix,
      className,
      closeLabel = 'Close',
      closeButton = false,
      ...props
    },
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'dialog-header');
    return (
      <AbstractDialogHeader
        ref={ref}
        {...props}
        className={clsx(className, bsPrefix)}
        closeLabel={closeLabel}
        closeButton={closeButton}
      />
    );
  },
);

DialogHeader.displayName = 'DialogHeader';

export default DialogHeader;
