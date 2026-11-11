import clsx from 'clsx';
import * as React from 'react';
import { useUncontrolled } from 'uncontrollable';
import useEventCallback from '@restart/hooks/useEventCallback';
import { useBootstrapPrefix } from './ThemeProvider.js';
import AlertHeading from './AlertHeading.js';
import AlertLink from './AlertLink.js';
import { HidingTransition } from './CssTransition.js';
import CloseButton from './CloseButton.js';
import type { Variant } from './types.js';
import type { TransitionType } from './helpers.js';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * @default 'alert'
   */
  bsPrefix?: string | undefined;

  /**
   * The Alert visual variant.
   *
   * @type {'primary' | 'accent' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'inverse' | undefined}
   */
  variant?: Variant | undefined;

  /**
   * Renders a properly aligned dismiss button, as well as
   * adding extra horizontal padding to the Alert.
   */
  dismissible?: boolean | undefined;

  /**
   * Controls the visual state of the Alert.
   *
   * @controllable onClose
   */
  show?: boolean | undefined;

  /**
   * Default show state of the Alert.
   */
  defaultShow?: boolean | undefined;

  /**
   * Callback fired when alert is closed.
   *
   * @type {((show: boolean, event: any) => void) | undefined}
   * @controllable show
   */
  onClose?: ((show: boolean, event: any) => void) | undefined;

  /**
   * Sets the text for alert close button.
   */
  closeLabel?: string | undefined;

  /**
   * Animate the alert dismissal. Defaults to fading out with `.hiding` or use
   * `false` to disable. A custom `react-transition-group` Transition can also
   * be provided.
   */
  transition?: TransitionType | undefined;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (uncontrolledProps, ref) => {
    const {
      bsPrefix,
      show = true,
      closeLabel = 'Close alert',
      className,
      children,
      variant = 'primary',
      onClose,
      dismissible,
      transition = HidingTransition,
      ...props
    } = useUncontrolled(uncontrolledProps, {
      show: 'onClose',
    });

    const prefix = useBootstrapPrefix(bsPrefix, 'alert');
    const handleClose = useEventCallback((e) => {
      if (onClose) {
        onClose(false, e);
      }
    });
    const Transition = transition === true ? HidingTransition : transition;
    const alert = (
      <div
        role="alert"
        {...(!Transition ? props : undefined)}
        ref={ref}
        className={clsx(className, prefix, variant && `theme-${variant}`)}
      >
        {children}
        {dismissible && (
          <CloseButton
            className="ms-auto"
            onClick={handleClose}
            aria-label={closeLabel}
          />
        )}
      </div>
    );

    if (!Transition) return show ? alert : null;

    return (
      <Transition unmountOnExit {...props} ref={undefined} in={show}>
        {alert}
      </Transition>
    );
  },
);

Alert.displayName = 'Alert';

export default Object.assign(Alert, {
  Link: AlertLink,
  Heading: AlertHeading,
});
