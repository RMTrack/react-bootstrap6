import clsx from 'clsx';
import * as React from 'react';
import { useBootstrapPrefix } from './ThemeProvider.js';
import type { Variant } from './types.js';
import PageItem, { Ellipsis, First, Last, Next, Prev } from './PageItem.js';

export interface PaginationProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'pagination'
   */
  bsPrefix?: string | undefined;

  /**
   * Sets the size of all PageItems.
   */
  size?: 'sm' | 'lg' | undefined;

  /**
   * The theme color of the links and active page, applied with `.theme-*`.
   */
  variant?: Variant | undefined;
}

const Pagination = React.forwardRef<HTMLUListElement, PaginationProps>(
  ({ bsPrefix, className, size, variant, ...props }, ref) => {
    const decoratedBsPrefix = useBootstrapPrefix(bsPrefix, 'pagination');
    return (
      <ul
        ref={ref}
        {...props}
        className={clsx(
          className,
          decoratedBsPrefix,
          size && `${decoratedBsPrefix}-${size}`,
          variant && `theme-${variant}`,
        )}
      />
    );
  },
);

Pagination.displayName = 'Pagination';

export default Object.assign(Pagination, {
  First,
  Prev,
  Ellipsis,
  Item: PageItem,
  Next,
  Last,
});
