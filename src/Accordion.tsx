import clsx from 'clsx';
import * as React from 'react';
import { useId, useMemo } from 'react';
import { useUncontrolled } from 'uncontrollable';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';
import AccordionBody from './AccordionBody.js';
import AccordionContext, {
  type AccordionSelectCallback,
  type AccordionEventKey,
} from './AccordionContext.js';
import AccordionHeader from './AccordionHeader.js';
import AccordionItem from './AccordionItem.js';

export interface AccordionProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'onSelect'
> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'accordion'
   */
  bsPrefix?: string | undefined;

  /**
   * The current active key that corresponds to the currently expanded card.
   */
  activeKey?: AccordionEventKey | undefined;

  /**
   * The default active key that is expanded on start
   */
  defaultActiveKey?: AccordionEventKey | undefined;

  /**
   * Callback fired when the active item changes.
   *
   * ```js
   * (eventKey: string | string[] | null, event: Object) => void
   * ```
   *
   * @controllable activeIndex
   */
  onSelect?: AccordionSelectCallback | undefined;

  /**
   * Renders accordion edge-to-edge with its parent container.
   */
  flush?: boolean | undefined;

  /**
   * Render a compact accordion with tighter padding, radius and type.
   */
  size?: 'sm' | undefined;

  /**
   * Space the items apart as separate rounded cards.
   */
  gap?: boolean | undefined;

  /**
   * Allow accordion items to stay open when another item is opened.
   */
  alwaysOpen?: boolean | undefined;
}

const Accordion: DynamicRefForwardingComponent<'div', AccordionProps> =
  React.forwardRef<HTMLElement, AccordionProps>((props, ref) => {
    const {
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'div',
      activeKey,
      bsPrefix,
      className,
      onSelect,
      flush,
      size,
      gap,
      alwaysOpen,
      ...controlledProps
    } = useUncontrolled(props, {
      activeKey: 'onSelect',
    });

    const prefix = useBootstrapPrefix(bsPrefix, 'accordion');
    const groupName = useId();

    // Items of an exclusive accordion share a `name`, so the browser keeps at
    // most one of the `<details>` open.
    const name = alwaysOpen || Array.isArray(activeKey) ? undefined : groupName;

    const contextValue = useMemo(
      () => ({
        activeEventKey: activeKey,
        onSelect,
        alwaysOpen,
        name,
      }),
      [activeKey, onSelect, alwaysOpen, name],
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <Component
          ref={ref}
          {...controlledProps}
          className={clsx(
            className,
            prefix,
            flush && `${prefix}-flush`,
            size && `${prefix}-${size}`,
            gap && `${prefix}-gap`,
          )}
        />
      </AccordionContext.Provider>
    );
  });

Accordion.displayName = 'Accordion';

export default Object.assign(Accordion, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Body: AccordionBody,
});
