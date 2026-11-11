import * as React from 'react';
import clsx from 'clsx';

export interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * An accessible label indicating the relevant information about the Close Button.
   */
  'aria-label'?: string | undefined;
}

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ className, 'aria-label': ariaLabel = 'Close', ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={clsx('btn-close', className)}
      aria-label={ariaLabel}
      {...props}
    />
  ),
);

CloseButton.displayName = 'CloseButton';

export default CloseButton;
