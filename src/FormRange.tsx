import clsx from 'clsx';
import * as React from 'react';
import { useContext, useRef } from 'react';
import useIsomorphicEffect from '@restart/hooks/useIsomorphicEffect';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import { useBootstrapPrefix } from './ThemeProvider.js';
import FormContext from './FormContext.js';

export interface FormRangeProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * The class of the `.form-range` wrapper. The `<input>` gets
   * `{bsPrefix}-input`.
   *
   * @default 'form-range'
   */
  bsPrefix?: string | undefined;

  /**
   * Uses `controlId` from `<FormGroup>` if not explicitly specified.
   */
  id?: string | undefined;

  /**
   * Manually style the input as valid
   */
  isValid?: boolean | undefined;

  /**
   * Manually style the input as invalid
   */
  isInvalid?: boolean | undefined;
}

function getFill(input: HTMLInputElement) {
  const min = parseFloat(input.min) || 0;
  const max = input.max === '' ? 100 : parseFloat(input.max);
  const value = parseFloat(input.value);
  if (!(max > min) || Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

/**
 * Renders Bootstrap 6's range markup: a `.form-range` wrapper around a
 * `.form-range-input`. Bootstrap's Range plugin normally keeps the filled
 * track (`--bs-range-fill`) in sync; this component does it instead.
 */
const FormRange = React.forwardRef<HTMLInputElement, FormRangeProps>(
  (
    {
      bsPrefix,
      className,
      id,
      isValid = false,
      isInvalid = false,
      onInput,
      ...props
    },
    ref,
  ) => {
    const { controlId } = useContext(FormContext);
    bsPrefix = useBootstrapPrefix(bsPrefix, 'form-range');

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const mergedRef = useMergedRefs<HTMLInputElement>(
      ref as any,
      inputRef as any,
    );

    const updateFill = () => {
      if (inputRef.current && wrapperRef.current) {
        wrapperRef.current.style.setProperty(
          '--bs-range-fill',
          `${getFill(inputRef.current)}`,
        );
      }
    };

    useIsomorphicEffect(updateFill);

    return (
      <div ref={wrapperRef} className={bsPrefix}>
        <input
          {...props}
          type="range"
          ref={mergedRef}
          onInput={(e) => {
            updateFill();
            onInput?.(e);
          }}
          className={clsx(
            className,
            `${bsPrefix}-input`,
            isValid && 'is-valid',
            isInvalid && 'is-invalid',
          )}
          id={id || controlId}
        />
      </div>
    );
  },
);

FormRange.displayName = 'FormRange';

export default FormRange;
