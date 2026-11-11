import * as React from 'react';

export type AccordionEventKey = string | string[] | null;

export declare type AccordionSelectCallback = (
  eventKey: AccordionEventKey,
  e: React.SyntheticEvent<unknown>,
) => void;

export interface AccordionContextValue {
  activeEventKey?: AccordionEventKey | undefined;
  onSelect?: AccordionSelectCallback | undefined;
  alwaysOpen?: boolean | undefined;
  /**
   * The `name` shared by the items' `<details>` elements, which makes them an
   * exclusive group. Not set when `alwaysOpen` is enabled.
   */
  name?: string | undefined;
}

export function isAccordionItemSelected(
  activeEventKey: AccordionEventKey | undefined,
  eventKey: string,
): boolean {
  return Array.isArray(activeEventKey)
    ? activeEventKey.includes(eventKey)
    : activeEventKey === eventKey;
}

const context = React.createContext<AccordionContextValue>({});
context.displayName = 'AccordionContext';

export default context;
