import * as React from 'react';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import Menu from './Menu.js';
import MenuToggle, { type PropsFromToggle } from './MenuToggle.js';
import MenuPanel, { type MenuPanelVariant } from './MenuPanel.js';
import type { BsMenuProps } from './types.js';

export interface MenuButtonProps
  extends
    BsMenuProps,
    PropsFromToggle,
    Omit<
      React.HTMLAttributes<HTMLElement>,
      'onSelect' | 'children' | 'onToggle' | 'title'
    > {
  /**
   * An html id attribute for the Toggle button, necessary for assistive technologies, such as screen readers.
   */
  id?: string | undefined;

  /**
   * An `href` passed to the Toggle component
   */
  href?: string | undefined;

  /**
   * The content of the non-toggle Button.
   */
  title: React.ReactNode;

  /**
   * An ARIA accessible role applied to the Menu component.
   */
  menuRole?: string | undefined;

  /**
   * Whether to render the menu panel in the DOM before the first time it is shown
   */
  renderMenuOnMount?: boolean | undefined;

  /**
   *  Which event when fired outside the component will cause it to be closed.
   *
   * _see [MenuPanel](#menu-panel-props) for more details_
   */
  rootCloseEvent?: 'click' | 'mousedown' | undefined;

  /**
   * Menu color variant.
   *
   * Omitting this will use the default light color.
   */
  menuVariant?: MenuPanelVariant | undefined;

  /**
   * Allow Menu to flip in case of an overlapping on the reference element. For more information refer to
   * Popper.js's flip [docs](https://popper.js.org/docs/v2/modifiers/flip/).
   */
  flip?: boolean | undefined;
}

/**
 * A convenience component for simple or general use menus. Renders a `Button` toggle and all `children`
 * are passed directly to the default `Menu.Panel`. This component accepts all of
 * [`Menu`'s props](#menu-props).
 *
 * _All unknown props are passed through to the `Menu` component._ Only
 * the Button `variant`, `size` and `bsPrefix` props are passed to the toggle,
 * along with menu-related props are passed to the `Menu.Panel`
 */
const MenuButton: DynamicRefForwardingComponent<'div', MenuButtonProps> =
  React.forwardRef<HTMLDivElement, MenuButtonProps>(
    (
      {
        title,
        children,
        bsPrefix,
        rootCloseEvent,
        variant,
        size,
        menuRole,
        renderMenuOnMount,
        disabled,
        href,
        id,
        menuVariant,
        flip,
        ...props
      },
      ref,
    ) => (
      <Menu ref={ref} {...props}>
        <MenuToggle
          id={id}
          href={href}
          size={size}
          variant={variant}
          disabled={disabled}
          childBsPrefix={bsPrefix}
        >
          {title}
        </MenuToggle>
        <MenuPanel
          role={menuRole}
          renderOnMount={renderMenuOnMount}
          rootCloseEvent={rootCloseEvent}
          variant={menuVariant}
          flip={flip}
        >
          {children}
        </MenuPanel>
      </Menu>
    ),
  );

MenuButton.displayName = 'MenuButton';

export default MenuButton;
