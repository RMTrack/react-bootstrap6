import clsx from 'clsx';
import * as React from 'react';
import { useContext } from 'react';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import AccordionItemContext from './AccordionItemContext.js';
import { useBootstrapPrefix } from './ThemeProvider.js';
import useAccordionButton from './useAccordionButton.js';

export interface AccordionHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'accordion-header'
   */
  bsPrefix?: string | undefined;

  /**
   * Prevents the header from toggling the item.
   */
  disabled?: boolean | undefined;
}

/**
 * Renders the `<summary>` of the item's `<details>`, followed by the
 * `.accordion-icon` chevron.
 */
const AccordionHeader: DynamicRefForwardingComponent<
  'summary',
  AccordionHeaderProps
> = React.forwardRef<HTMLElement, AccordionHeaderProps>(
  (
    {
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'summary',
      bsPrefix,
      className,
      children,
      disabled,
      onClick,
      tabIndex,
      ...props
    },
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-header');
    const iconPrefix = useBootstrapPrefix(undefined, 'accordion-icon');
    const { eventKey } = useContext(AccordionItemContext);
    const accordionOnClick = useAccordionButton(eventKey, onClick);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      // The open state is driven by the Accordion's active key, so stop the
      // native <details> toggle and update the key instead.
      e.preventDefault();
      if (disabled) return;
      accordionOnClick(e);
    };

    return (
      <Component
        ref={ref}
        {...props}
        tabIndex={disabled ? -1 : tabIndex}
        aria-disabled={disabled || undefined}
        onClick={handleClick}
        className={clsx(className, bsPrefix)}
      >
        {children}
        <svg
          className={iconPrefix}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m2 5 6 6 6-6" />
        </svg>
      </Component>
    );
  },
);

AccordionHeader.displayName = 'AccordionHeader';

export default AccordionHeader;
