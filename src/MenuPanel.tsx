import clsx from 'clsx';
import * as React from 'react';
import { useContext } from 'react';
import {
  useDropdownMenu,
  UseDropdownMenuOptions,
} from '@restart/ui/DropdownMenu';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import useIsomorphicEffect from '@restart/hooks/useIsomorphicEffect';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import useMediaQuery from '@restart/hooks/useMediaQuery';
import { warn } from './internal/warning.js';
import MenuContext, { type DropDirection } from './MenuContext.js';
import InputGroupContext from './InputGroupContext.js';
import { toBreakpointName, useBootstrapPrefix } from './ThemeProvider.js';
import useWrappedRefWithWarning from './useWrappedRefWithWarning.js';
import type { AlignType, AlignDirection, Placement } from './types.js';
import type { LiteralUnion } from './types.js';

export type MenuPanelVariant = LiteralUnion<'dark', string>;

export interface MenuPanelProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Control the rendering of the MenuPanel. All non-menu props
   * (listed here) are passed through to the `as` Component.
   *
   * If providing a custom, non DOM, component. the `show`, `close` and `align` props
   * are also injected and should be handled appropriately.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'menu'
   */
  bsPrefix?: string | undefined;

  /**
   * Controls the visibility of the Menu menu
   */
  show?: boolean | undefined;

  /**
   * Whether to render the menu panel in the DOM before the first time it is shown
   */
  renderOnMount?: boolean | undefined;

  /**
   * Have the menu switch to it's opposite placement when necessary to stay on screen.
   */
  flip?: boolean | undefined;

  /**
   * Aligns the menu to the specified side of the container. You can also align
   * the menu responsively for breakpoints starting at `sm` and up. The alignment
   * direction will affect the specified breakpoint or larger, and the opposite
   * alignment is used below it.
   */
  align?: AlignType | undefined;

  /**
   * Which event when fired outside the component will cause it to be closed
   *
   * *Note: For custom menu components, you will have to pass the
   * `rootCloseEvent` to `<RootCloseWrapper>` in your custom menu panel
   * component ([similarly to how it is implemented in `<Menu.Panel>`](https://github.com/react-bootstrap/react-bootstrap/blob/v0.31.5/src/MenuPanel.js#L115-L119)).*
   */
  rootCloseEvent?: 'click' | 'mousedown' | undefined;

  /**
   * A set of popper options and props passed directly to Popper.
   */
  popperConfig?: UseDropdownMenuOptions['popperConfig'] | undefined;

  /**
   * Menu color variant. `dark` renders the menu with `data-bs-theme="dark"`.
   *
   * Omitting this will follow the page's color mode.
   */
  variant?: MenuPanelVariant | undefined;
}

// Bootstrap 6's default breakpoints, used for responsive menu alignment.
const BREAKPOINT_WIDTHS: Record<string, number> = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function getMenuPlacement(
  alignEnd: boolean,
  dropDirection?: DropDirection,
  isRTL?: boolean,
) {
  const topStart = isRTL ? 'top-end' : 'top-start';
  const topEnd = isRTL ? 'top-start' : 'top-end';
  const bottomStart = isRTL ? 'bottom-end' : 'bottom-start';
  const bottomEnd = isRTL ? 'bottom-start' : 'bottom-end';
  const leftStart = isRTL ? 'right-start' : 'left-start';
  const leftEnd = isRTL ? 'right-end' : 'left-end';
  const rightStart = isRTL ? 'left-start' : 'right-start';
  const rightEnd = isRTL ? 'left-end' : 'right-end';

  let placement: Placement = alignEnd ? bottomEnd : bottomStart;
  if (dropDirection === 'up') placement = alignEnd ? topEnd : topStart;
  else if (dropDirection === 'end')
    placement = alignEnd ? rightEnd : rightStart;
  else if (dropDirection === 'start')
    placement = alignEnd ? leftEnd : leftStart;
  else if (dropDirection === 'down-centered') placement = 'bottom';
  else if (dropDirection === 'up-centered') placement = 'top';
  return placement;
}

const MenuPanel: DynamicRefForwardingComponent<'div', MenuPanelProps> =
  React.forwardRef<HTMLElement, MenuPanelProps>(
    (
      {
        bsPrefix,
        className,
        align,
        rootCloseEvent,
        flip = true,
        show: showProps,
        renderOnMount,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'div',
        popperConfig,
        variant,
        ...props
      },
      ref,
    ) => {
      let alignEnd = false;
      const prefix = useBootstrapPrefix(bsPrefix, 'menu');
      const { align: contextAlign, drop, isRTL } = useContext(MenuContext);
      align = align || contextAlign;
      const isInputGroup = useContext(InputGroupContext);

      let responsiveQuery: string | null = null;
      let responsiveDirection: AlignDirection | undefined;
      if (align) {
        if (typeof align === 'object') {
          const keys = Object.keys(align);

          warn(
            keys.length === 1,
            'There should only be 1 breakpoint when passing an object to `align`',
          );

          if (keys.length) {
            const brkPoint = keys[0];
            responsiveDirection = align[brkPoint];
            const width = BREAKPOINT_WIDTHS[toBreakpointName(brkPoint)];

            warn(
              width != null,
              'Responsive `align` only supports the Bootstrap breakpoints, got "' +
                brkPoint +
                '".',
            );
            if (width != null) responsiveQuery = `(min-width: ${width}px)`;
          }
        } else if (align === 'end') {
          alignEnd = true;
        }
      }

      // Bootstrap 6 has no responsive alignment classes; like its Menu plugin,
      // pick the placement in JS.
      const matchesBreakpoint = useMediaQuery(responsiveQuery);
      if (responsiveQuery) {
        alignEnd = matchesBreakpoint
          ? responsiveDirection === 'end'
          : responsiveDirection === 'start';
      }

      const placement = getMenuPlacement(alignEnd, drop, isRTL);

      const [menuProps, { hasShown, popper, show, toggle }] = useDropdownMenu({
        flip,
        rootCloseEvent,
        show: showProps,
        // Bootstrap 6 has no navbar-specific menu CSS; like its Menu plugin,
        // position menus in navbars too.
        usePopper: true,
        offset: [0, 2],
        popperConfig,
        placement,
      });

      menuProps.ref = useMergedRefs(
        useWrappedRefWithWarning(ref, 'MenuPanel'),
        menuProps.ref,
      );

      useIsomorphicEffect(() => {
        // Popper's initial position for the menu is incorrect when
        // renderOnMount=true. Need to call update() to correct it.
        if (show) popper?.update();
      }, [show]);

      if (!hasShown && !renderOnMount && !isInputGroup) return null;

      // For custom components provide additional, non-DOM, props;
      if (typeof Component !== 'string') {
        menuProps.show = show;
        menuProps.close = () => toggle?.(false);
        menuProps.align = align;
      }

      let style = props.style;
      if (popper?.placement) {
        // we don't need the default popper style,
        // menus are display: none when not shown.
        style = { ...props.style, ...menuProps.style };
      }

      return (
        <Component
          {...props}
          {...menuProps}
          style={style}
          // Bootstrap's menu CSS (e.g. its transform origin) reads the
          // placement from this attribute.
          data-bs-placement={popper?.placement ?? placement}
          {...(variant === 'dark' && { 'data-bs-theme': 'dark' })}
          className={clsx(
            className,
            prefix,
            show && 'show',
            variant && variant !== 'dark' && `${prefix}-${variant}`,
          )}
        />
      );
    },
  );

MenuPanel.displayName = 'MenuPanel';

export default MenuPanel;
