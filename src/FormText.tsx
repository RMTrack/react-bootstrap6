import clsx from 'clsx';
import * as React from 'react';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface FormTextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'form-text'
   */
  bsPrefix?: string | undefined;

  /**
   * A convenience prop for adding the `fg-secondary` class (Bootstrap 5's
   * `text-muted`).
   */
  muted?: boolean | undefined;
}

const FormText: DynamicRefForwardingComponent<'small', FormTextProps> =
  React.forwardRef<HTMLElement, FormTextProps>(
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    (
      { bsPrefix, className, as: Component = 'small', muted, ...props },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'form-text');

      return (
        <Component
          {...props}
          ref={ref}
          className={clsx(className, bsPrefix, muted && 'fg-secondary')}
        />
      );
    },
  );

FormText.displayName = 'FormText';

export default FormText;
