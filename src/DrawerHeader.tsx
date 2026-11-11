import clsx from 'clsx';
import * as React from 'react';
import { useBootstrapPrefix } from './ThemeProvider.js';
import AbstractDialogHeader, {
  type AbstractDialogHeaderProps,
} from './AbstractDialogHeader.js';

export interface DrawerHeaderProps extends AbstractDialogHeaderProps {
  /**
   * @default 'drawer-header'
   */
  bsPrefix?: string | undefined;
}

const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
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
    bsPrefix = useBootstrapPrefix(bsPrefix, 'drawer-header');
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

DrawerHeader.displayName = 'DrawerHeader';

export default DrawerHeader;
