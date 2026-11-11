import clsx from 'clsx';
import * as React from 'react';
import { useBootstrapPrefix } from './ThemeProvider.js';
import type { LiteralUnion } from './types.js';

export type AspectRatio = LiteralUnion<'1x1' | '4x3' | '16x9' | '21x9', string>;

export interface RatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * @default 'ratio'
   */
  bsPrefix?: string | undefined;

  /**
   * This component requires a single child element
   */
  children: React.ReactElement | string | number;

  /**
   * Set the aspect ratio of the embed. A fraction or a percentage can also
   * be used to create custom aspect ratios.
   */
  aspectRatio?: AspectRatio | number | undefined;
}

// Custom ratios are given as height / width, either as a fraction (0.5) or a
// percentage (50). Bootstrap 6's `--bs-ratio` is an `aspect-ratio` value.
function toAspectRatio(num: number): string {
  if (num <= 0) return '1 / 1';
  const percent = num < 1 ? num * 100 : num;
  return `100 / ${percent}`;
}

const Ratio = React.forwardRef<HTMLDivElement, RatioProps>(
  (
    { bsPrefix, className, children, aspectRatio = '1x1', style, ...props },
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'ratio');
    const isCustomRatio = typeof aspectRatio === 'number';
    const child = React.Children.only(children);

    return (
      <div
        ref={ref}
        {...props}
        style={{
          ...style,
          ...(isCustomRatio && {
            '--bs-ratio': toAspectRatio(aspectRatio as number),
          }),
        }}
        className={clsx(
          className,
          `${bsPrefix}-${isCustomRatio ? 'auto' : aspectRatio}`,
        )}
      >
        {
          // Bootstrap 6 ratio utilities size the element itself, so stretch the
          // embedded element to fill the ratio box.
          React.isValidElement<{ className?: string }>(child)
            ? React.cloneElement(child, {
                className: clsx(child.props.className, 'w-100', 'h-100'),
              })
            : child
        }
      </div>
    );
  },
);

Ratio.displayName = 'Ratio';

export default Ratio;
