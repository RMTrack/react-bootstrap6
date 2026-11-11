import clsx from 'clsx';
import * as React from 'react';
import { useContext, useMemo, useRef } from 'react';
import BaseDropdown, { ToggleMetadata } from '@restart/ui/Dropdown';
import { useUncontrolled } from 'uncontrollable';
import useEventCallback from '@restart/hooks/useEventCallback';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import MenuContext from './MenuContext.js';
import MenuDivider from './MenuDivider.js';
import MenuHeader from './MenuHeader.js';
import MenuItem from './MenuItem.js';
import MenuText from './MenuText.js';
import MenuPanel, { getMenuPlacement } from './MenuPanel.js';
import MenuToggle from './MenuToggle.js';
import InputGroupContext from './InputGroupContext.js';
import { useBootstrapPrefix, useIsRTL } from './ThemeProvider.js';
import type { BsMenuProps } from './types.js';

export interface MenuProps
  extends
    BsMenuProps,
    Omit<
      React.HTMLAttributes<HTMLElement>,
      'onSelect' | 'children' | 'onToggle'
    > {}

const Menu: DynamicRefForwardingComponent<'div', MenuProps> = React.forwardRef<
  HTMLElement,
  MenuProps
>((pProps, ref) => {
  const {
    bsPrefix,
    drop = 'down',
    show,
    className,
    align = 'start',
    onSelect,
    onToggle,
    focusFirstItemOnShow,
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    as: Component = 'div',
    navbar: _4,
    autoClose = true,
    ...props
  } = useUncontrolled(pProps, { show: 'onToggle' });

  const isInputGroup = useContext(InputGroupContext);
  const prefix = useBootstrapPrefix(bsPrefix, 'menu');
  const isRTL = useIsRTL();
  const toggleRef = useRef<HTMLElement | null>(null);

  const isClosingPermitted = (source: string): boolean => {
    // autoClose=false only permits close on button click
    if (autoClose === false) return source === 'click';

    // autoClose=inside doesn't permit close on rootClose
    if (autoClose === 'inside') return source !== 'rootClose';

    // autoClose=outside doesn't permit close on select
    if (autoClose === 'outside') return source !== 'select';

    return true;
  };

  const handleToggle = useEventCallback(
    (nextShow: boolean, meta: ToggleMetadata) => {
      /** Checking if target of event is ToggleButton,
       * if it is then nullify mousedown event
       */
      const target = meta.originalEvent?.target as Node | null | undefined;
      const isToggleButton = !!target && !!toggleRef.current?.contains(target);

      if (isToggleButton && meta.source === 'mousedown') {
        return;
      }

      if (
        meta.originalEvent!.currentTarget === document &&
        (meta.source !== 'keydown' ||
          (meta.originalEvent as any).key === 'Escape')
      )
        meta.source = 'rootClose';

      if (isClosingPermitted(meta.source!)) onToggle?.(nextShow, meta);
    },
  );

  const alignEnd = align === 'end';
  const placement = getMenuPlacement(alignEnd, drop, isRTL);

  const contextValue = useMemo(
    () => ({
      align,
      drop,
      isRTL,
      toggleRef,
    }),
    [align, drop, isRTL],
  );

  return (
    <MenuContext.Provider value={contextValue}>
      <BaseDropdown
        placement={placement}
        show={show}
        onSelect={onSelect}
        onToggle={handleToggle}
        focusFirstItemOnShow={focusFirstItemOnShow}
        itemSelector={`.${prefix}-item:not(.disabled):not(:disabled)`}
      >
        {isInputGroup ? (
          props.children
        ) : (
          <Component
            {...props}
            ref={ref}
            // Bootstrap 6 needs no wrapper class: the toggle and `.menu`
            // are siblings, and `drop` sets the menu's placement.
            className={clsx(className, show && 'show') || undefined}
          />
        )}
      </BaseDropdown>
    </MenuContext.Provider>
  );
});

Menu.displayName = 'Menu';

export default Object.assign(Menu, {
  Toggle: MenuToggle,
  Panel: MenuPanel,
  Item: MenuItem,
  Text: MenuText,
  Divider: MenuDivider,
  Header: MenuHeader,
});
