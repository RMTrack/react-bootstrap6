import * as React from 'react';
import Button from './Button.js';
import ButtonGroup from './ButtonGroup.js';
import Menu from './Menu.js';
import type { PropsFromToggle } from './MenuToggle.js';
import { BsMenuProps } from './types.js';

export interface SplitButtonProps
  extends
    BsMenuProps,
    PropsFromToggle,
    Omit<
      React.HTMLAttributes<HTMLElement>,
      'onSelect' | 'children' | 'onToggle' | 'title'
    > {
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
   * An `href` passed to the non-toggle Button
   */
  href?: string | undefined;

  /**
   * An anchor `target` passed to the non-toggle Button
   */
  target?: string | undefined;

  /**
   * The content of the non-toggle Button.
   */
  title: React.ReactNode;

  /**
   * Accessible label for the toggle; the value of `title` if not specified.
   */
  toggleLabel?: string | undefined;

  /*
   * A `type` passed to the non-toggle Button
   */
  type?: 'submit' | 'reset' | 'button' | undefined;

  /**
   * Allow Menu to flip in case of an overlapping on the reference element. For more information refer to
   * Popper.js's flip [docs](https://popper.js.org/docs/v2/modifiers/flip/).
   */
  flip?: boolean | undefined;
}

/**
 * A convenience component for simple or general use split button menus. Renders a
 * `ButtonGroup` containing a `Button` and a `Button` toggle for the `Menu`. All `children`
 * are passed directly to the default `Menu.Panel`. This component accepts all of [`Menu`'s
 * props](#menu-props).
 *
 * _All unknown props are passed through to the `Menu` component._
 * The Button `variant`, `size` and `bsPrefix` props are passed to the button and toggle,
 * and menu-related props are passed to the `Menu.Panel`
 */
const SplitButton = React.forwardRef<HTMLElement, SplitButtonProps>(
  (
    {
      id,
      bsPrefix,
      size,
      variant,
      title,
      type = 'button',
      toggleLabel = 'Toggle menu',
      children,
      onClick,
      href,
      target,
      menuRole,
      renderMenuOnMount,
      rootCloseEvent,
      flip,
      ...props
    },
    ref,
  ) => (
    <Menu ref={ref} {...props} as={ButtonGroup}>
      <Button
        size={size}
        variant={variant}
        disabled={props.disabled}
        bsPrefix={bsPrefix}
        href={href}
        target={target}
        onClick={onClick}
        type={type}
      >
        {title}
      </Button>
      <Menu.Toggle
        split
        id={id}
        size={size}
        variant={variant}
        disabled={props.disabled}
        childBsPrefix={bsPrefix}
      >
        <span className="visually-hidden">{toggleLabel}</span>
      </Menu.Toggle>

      <Menu.Panel
        role={menuRole}
        renderOnMount={renderMenuOnMount}
        rootCloseEvent={rootCloseEvent}
        flip={flip}
      >
        {children}
      </Menu.Panel>
    </Menu>
  ),
);

SplitButton.displayName = 'SplitButton';

export default SplitButton;
