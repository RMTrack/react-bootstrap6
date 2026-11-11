import clsx from 'clsx';
import * as React from 'react';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';

export interface AccordionBodyProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'accordion-body'
   */
  bsPrefix?: string | undefined;
}

/**
 * The content of an item. It stays in the DOM while collapsed; the native
 * `<details>` element hides it and animates its height.
 */
const AccordionBody: DynamicRefForwardingComponent<'div', AccordionBodyProps> =
  React.forwardRef<HTMLElement, AccordionBodyProps>(
    (
      {
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'div',
        bsPrefix,
        className,
        ...props
      },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-body');

      return (
        <Component ref={ref} {...props} className={clsx(className, bsPrefix)} />
      );
    },
  );

AccordionBody.displayName = 'AccordionBody';

export default AccordionBody;
