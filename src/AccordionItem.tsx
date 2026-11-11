import clsx from 'clsx';
import * as React from 'react';
import { useContext, useMemo } from 'react';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';
import AccordionContext, {
  isAccordionItemSelected,
} from './AccordionContext.js';
import AccordionItemContext, {
  type AccordionItemContextValue,
} from './AccordionItemContext.js';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'accordion-item'
   */
  bsPrefix?: string | undefined;

  /**
   * A unique key used to control this item's collapse/expand.
   */
  eventKey: string;
}

function hasOpenGroupSibling(details: HTMLDetailsElement) {
  return Array.from(details.parentElement?.children ?? []).some(
    (el) =>
      el !== details &&
      el instanceof HTMLDetailsElement &&
      el.name === details.name &&
      el.open,
  );
}

/**
 * Renders a native `<details>` element. Its `open` state follows the
 * Accordion's `activeKey`.
 */
const AccordionItem: DynamicRefForwardingComponent<
  'details',
  AccordionItemProps
> = React.forwardRef<HTMLElement, AccordionItemProps>(
  (
    {
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'details',
      bsPrefix,
      className,
      eventKey,
      onToggle,
      ...props
    },
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-item');
    const { activeEventKey, onSelect, alwaysOpen, name } =
      useContext(AccordionContext);
    const isSelected = isAccordionItemSelected(activeEventKey, eventKey);

    const contextValue = useMemo<AccordionItemContextValue>(
      () => ({
        eventKey,
      }),
      [eventKey],
    );

    // Header clicks are handled through `onSelect`, so a `toggle` that doesn't
    // match the selected state came from the browser (e.g. find-in-page
    // expanding a match, or another item of the `name` group opening).
    // Report it so the active key stays in sync with the DOM.
    const handleToggle = (e: React.SyntheticEvent<HTMLElement>) => {
      onToggle?.(e as any);

      const details = e.currentTarget as HTMLDetailsElement;
      const { open } = details;
      if (open === isSelected) return;

      if (alwaysOpen) {
        const keys = Array.isArray(activeEventKey)
          ? activeEventKey
          : activeEventKey
            ? [activeEventKey]
            : [];
        const rest = keys.filter((k) => k !== eventKey);
        onSelect?.(open ? [...rest, eventKey] : rest, e);
      } else if (open) {
        onSelect?.(eventKey, e);
      } else if (!details.name || !hasOpenGroupSibling(details)) {
        onSelect?.(null, e);
      }
    };

    return (
      <AccordionItemContext.Provider value={contextValue}>
        <Component
          ref={ref}
          name={name}
          {...props}
          open={isSelected}
          onToggle={handleToggle}
          className={clsx(className, bsPrefix)}
        />
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
