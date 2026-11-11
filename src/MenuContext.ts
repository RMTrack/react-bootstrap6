import * as React from 'react';
import type { AlignType } from './types.js';

export type DropDirection =
  'up' | 'up-centered' | 'start' | 'end' | 'down' | 'down-centered';

export type MenuContextValue = {
  align?: AlignType;
  drop?: DropDirection;
  isRTL?: boolean;
  /** The toggle element, so the Menu can recognize clicks on it. */
  toggleRef?: React.MutableRefObject<HTMLElement | null>;
};

const MenuContext = React.createContext<MenuContextValue>({});
MenuContext.displayName = 'MenuContext';

export default MenuContext;
