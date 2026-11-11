import clsx from 'clsx';
import * as React from 'react';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';
import BreadcrumbItem from './BreadcrumbItem.js';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'breadcrumb'
   */
  bsPrefix?: string | undefined;

  /**
   * ARIA label for the nav element
   * https://www.w3.org/TR/wai-aria-practices/#breadcrumb
   */
  label?: string | undefined;

  /**
   * Additional props passed as-is to the underlying `<ol>` element
   */
  listProps?: React.OlHTMLAttributes<HTMLOListElement> | undefined;

  /**
   * Content of the `.breadcrumb-divider` rendered between items. Leave it
   * empty for Bootstrap's default chevron, or pass text or an icon.
   */
  divider?: React.ReactNode | undefined;
}

const Breadcrumb: DynamicRefForwardingComponent<'nav', BreadcrumbProps> =
  React.forwardRef<HTMLElement, BreadcrumbProps>(
    (
      {
        bsPrefix,
        className,
        listProps = {},
        children,
        label = 'breadcrumb',
        divider,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'nav',
        ...props
      },
      ref,
    ) => {
      const prefix = useBootstrapPrefix(bsPrefix, 'breadcrumb');
      // toArray() drops null, undefined and boolean children.
      const items = React.Children.toArray(children);

      return (
        <Component
          aria-label={label}
          className={className}
          ref={ref}
          {...props}
        >
          <ol {...listProps} className={clsx(prefix, listProps?.className)}>
            {items.map((child, index) => (
              <React.Fragment key={(child as any)?.key ?? index}>
                {index > 0 && (
                  <li className={`${prefix}-divider`} aria-hidden="true">
                    {divider}
                  </li>
                )}
                {child}
              </React.Fragment>
            ))}
          </ol>
        </Component>
      );
    },
  );

Breadcrumb.displayName = 'Breadcrumb';

export default Object.assign(Breadcrumb, {
  Item: BreadcrumbItem,
});
