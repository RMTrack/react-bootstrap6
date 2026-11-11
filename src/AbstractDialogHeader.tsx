import * as React from 'react';
import { useContext } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';
import CloseButton from './CloseButton.js';
import DialogContext from './DialogContext.js';

export interface AbstractDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Provides an accessible label for the close
   * button. It is used for Assistive Technology when the label text is not
   * readable.
   */
  closeLabel?: string | undefined;

  /**
   * Specify whether the Component should contain a close button
   */
  closeButton?: boolean | undefined;

  /**
   * A Callback fired when the close button is clicked. If used directly inside
   * a DialogContext, the onHide will automatically be propagated up
   * to the parent `onHide`.
   *
   * @type {(() => void) | undefined}
   */
  onHide?: (() => void) | undefined;
}

const AbstractDialogHeader = React.forwardRef<
  HTMLDivElement,
  AbstractDialogHeaderProps
>(
  (
    { closeLabel = 'Close', closeButton = false, onHide, children, ...props },
    ref,
  ) => {
    const context = useContext(DialogContext);

    const handleClick = useEventCallback(() => {
      context?.onHide();
      onHide?.();
    });

    return (
      <div ref={ref} {...props}>
        {children}

        {closeButton && (
          <CloseButton aria-label={closeLabel} onClick={handleClick} />
        )}
      </div>
    );
  },
);

AbstractDialogHeader.displayName = 'AbstractDialogHeader';

export default AbstractDialogHeader;
