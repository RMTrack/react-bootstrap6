import clsx from 'clsx';
import * as React from 'react';
import { toBreakpointName, useBootstrapPrefix } from './ThemeProvider.js';
import type { Variant } from './types.js';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /**
   * @default 'table'
   */
  bsPrefix?: string | undefined;

  /**
   * Adds zebra-striping to any table row within the `<tbody>`.
   * Use `columns` to add zebra-striping to any table column.
   */
  striped?: boolean | string | undefined;

  /**
   * Adds borders on all sides of the table and cells.
   */
  bordered?: boolean | undefined;

  /**
   * Removes all borders on the table and cells, including table header.
   */
  borderless?: boolean | undefined;

  /**
   * Enable a hover state on table rows within a `<tbody>`.
   */
  hover?: boolean | undefined;

  /**
   * Make tables more compact by cutting cell padding in half by setting
   * size as `sm`.
   */
  size?: string | undefined;

  /**
   * The theme color of the table, applied with `.theme-*`.
   */
  variant?: Variant | undefined;

  /**
   * Stack each row into a block on narrow containers. Pass a breakpoint
   * to stack below it only (`.md:table-stacked`). Stacked tables use a
   * container query, so a parent needs to be a query container
   * (e.g. `.contains-inline`).
   */
  stacked?: boolean | string | undefined;

  /**
   * Responsive tables allow tables to be scrolled horizontally with ease.
   * Across every breakpoint, use `responsive` for horizontally
   * scrolling tables. Responsive tables are wrapped automatically in a `div`.
   * Use `responsive="sm"`, `responsive="md"`, `responsive="lg"`,
   * `responsive="xl"` or `responsive="2xl"` as needed to create responsive
   * tables up to a particular breakpoint (`.md:table-responsive`). From that
   * breakpoint and up, the table will behave normally and not scroll
   * horizontally.
   */
  responsive?: boolean | string | undefined;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      bsPrefix,
      className,
      striped,
      bordered,
      borderless,
      hover,
      size,
      variant,
      responsive,
      stacked,
      ...props
    },
    ref,
  ) => {
    const decoratedBsPrefix = useBootstrapPrefix(bsPrefix, 'table');

    const classes = clsx(
      className,
      decoratedBsPrefix,
      variant && `theme-${variant}`,
      size && `${decoratedBsPrefix}-${size}`,
      striped &&
        `${decoratedBsPrefix}-${
          typeof striped === 'string' ? `striped-${striped}` : 'striped'
        }`,
      bordered && `${decoratedBsPrefix}-bordered`,
      borderless && `${decoratedBsPrefix}-borderless`,
      hover && `${decoratedBsPrefix}-hover`,
      stacked &&
        (typeof stacked === 'string'
          ? `${toBreakpointName(stacked)}:${decoratedBsPrefix}-stacked`
          : `${decoratedBsPrefix}-stacked`),
    );

    const table = <table {...props} className={classes} ref={ref} />;
    if (responsive) {
      let responsiveClass = `${decoratedBsPrefix}-responsive`;
      if (typeof responsive === 'string') {
        responsiveClass = `${toBreakpointName(responsive)}:${responsiveClass}`;
      }

      return <div className={responsiveClass}>{table}</div>;
    }

    return table;
  },
);

Table.displayName = 'Table';

export default Table;
