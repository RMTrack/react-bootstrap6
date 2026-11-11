import clsx from 'clsx';
import * as React from 'react';
import { useContext } from 'react';
import FormContext from './FormContext.js';

export interface FormCheckLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * An optional class for the label. Bootstrap 6 check, radio and switch
   * labels are plain `<label>`s laid out by `.form-field`.
   */
  bsPrefix?: string | undefined;

  /**
   * The HTML for attribute for associating the label with an input
   */
  htmlFor?: string | undefined;
}

const FormCheckLabel = React.forwardRef<HTMLLabelElement, FormCheckLabelProps>(
  ({ bsPrefix, className, htmlFor, ...props }, ref) => {
    const { controlId } = useContext(FormContext);

    return (
      <label
        {...props}
        ref={ref}
        htmlFor={htmlFor || controlId}
        className={clsx(className, bsPrefix) || undefined}
      />
    );
  },
);

FormCheckLabel.displayName = 'FormCheckLabel';

export default FormCheckLabel;
