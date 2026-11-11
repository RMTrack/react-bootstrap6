import clsx from 'clsx';
import * as React from 'react';
import { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';
import Menu from './Menu.js';
import type { MenuPanelVariant } from './MenuPanel.js';
import NavLink from './NavLink.js';
import type { BsMenuProps } from './types.js';

export interface NavMenuProps
  extends
    BsMenuProps,
    Omit<
      React.HTMLAttributes<HTMLElement>,
      'onSelect' | 'children' | 'onToggle' | 'title'
    > {
  /**
   * An html id attribute for the Toggle button, necessary for assistive technologies, such as screen readers.
   */
  id?: string | undefined;

  /**
   * The content of the non-toggle Button.
   */
  title: React.ReactNode;

  /**
   * Disables the toggle NavLink
   */
  disabled?: boolean | undefined;

  /**
   * Style the toggle NavLink as active
   */
  active?: boolean | undefined;

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
   * _see [MenuPanel](#menu-props) for more details_
   */
  rootCloseEvent?: 'click' | 'mousedown' | undefined;

  /**
   * Menu color variant.
   *
   * Omitting this will use the default light color.
   */
  menuVariant?: MenuPanelVariant | undefined;
}

const NavMenu: DynamicRefForwardingComponent<'div', NavMenuProps> =
  React.forwardRef(
    (
      {
        id,
        title,
        children,
        bsPrefix,
        className,
        rootCloseEvent,
        menuRole,
        disabled,
        active,
        renderMenuOnMount,
        menuVariant,
        ...props
      }: NavMenuProps,
      ref,
    ) => {
      /* NavItem has no additional logic, it's purely presentational. Can set nav item class here to support "as" */
      const navItemPrefix = useBootstrapPrefix(undefined, 'nav-item');

      return (
        <Menu ref={ref} {...props} className={clsx(className, navItemPrefix)}>
          <Menu.Toggle
            id={id}
            eventKey={null}
            active={active}
            disabled={disabled}
            childBsPrefix={bsPrefix}
            as={NavLink}
          >
            {title}
          </Menu.Toggle>

          <Menu.Panel
            role={menuRole}
            renderOnMount={renderMenuOnMount}
            rootCloseEvent={rootCloseEvent}
            variant={menuVariant}
          >
            {children}
          </Menu.Panel>
        </Menu>
      );
    },
  );

NavMenu.displayName = 'NavMenu';

export default Object.assign(NavMenu, {
  Item: Menu.Item,
  Text: Menu.Text,
  Divider: Menu.Divider,
  Header: Menu.Header,
});
