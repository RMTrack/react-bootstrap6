import clsx from 'clsx';
import * as React from 'react';
import { useContext } from 'react';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import FormContext from './FormContext.js';
import { useBootstrapPrefix } from './ThemeProvider.js';

export type FormCheckInputType = 'checkbox' | 'radio' | 'switch';

export interface FormCheckInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * The class of the input: `check` for checkboxes, `radio` for radios. For
   * switches it is the class of the `.switch` wrapper around the input.
   *
   * @default 'check' | 'radio' | 'switch'
   */
  bsPrefix?: string | undefined;

  /**
   * A HTML id attribute, necessary for proper form accessibility.
   */
  id?: string | undefined;

  /**
   * The type of checkable. A `switch` renders a checkbox with
   * `role="switch"` inside a `.switch` wrapper.
   */
  type?: FormCheckInputType | undefined;

  /**
   * Manually style the input as valid
   */
  isValid?: boolean | undefined;

  /**
   * Manually style the input as invalid
   */
  isInvalid?: boolean | undefined;
}

const FormCheckInput: DynamicRefForwardingComponent<
  'input',
  FormCheckInputProps
> = React.forwardRef<HTMLInputElement, FormCheckInputProps>(
  (
    {
      id,
      bsPrefix,
      className,
      type = 'checkbox',
      isValid = false,
      isInvalid = false,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'input',
      ...props
    },
    ref,
  ) => {
    const { controlId } = useContext(FormContext);
    const isSwitch = type === 'switch';
    bsPrefix = useBootstrapPrefix(
      bsPrefix,
      isSwitch ? 'switch' : type === 'radio' ? 'radio' : 'check',
    );

    const validationClasses = [
      isValid && 'is-valid',
      isInvalid && 'is-invalid',
    ];

    if (isSwitch) {
      return (
        <div className={bsPrefix}>
          <Component
            role="switch"
            // Enables the native switch control where supported (Safari).
            switch=""
            {...props}
            ref={ref}
            type="checkbox"
            id={id || controlId}
            className={clsx(className, ...validationClasses) || undefined}
          />
        </div>
      );
    }

    return (
      <Component
        {...props}
        ref={ref}
        type={type}
        id={id || controlId}
        className={clsx(className, bsPrefix, ...validationClasses)}
      />
    );
  },
);

FormCheckInput.displayName = 'FormCheckInput';

export default FormCheckInput;
