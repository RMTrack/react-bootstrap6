import clsx from 'clsx';
import * as React from 'react';
import {
  useButtonProps,
  type ButtonProps as BaseButtonProps,
} from '@restart/ui/Button';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';
import type { ButtonStyle, ButtonVariant } from './types.js';

const BUTTON_STYLES: readonly string[] = [
  'solid',
  'outline',
  'subtle',
  'text',
  'styled',
] satisfies ButtonStyle[];

/**
 * Maps a button `variant` to Bootstrap 6 classes, which compose a style class
 * with a `.theme-*` class:
 *
 * - `'primary'` -> `btn-solid theme-primary`
 * - `'outline-primary'` -> `btn-outline theme-primary` (also `subtle-*`, `text-*`)
 * - `'styled-primary'` -> `btn-solid btn-styled theme-primary`
 * - `'link'` -> `btn-link`
 *
 * Without a variant only the base `.btn` class is used.
 */
export function getButtonVariantClasses(
  prefix: string,
  variant: ButtonVariant | null | undefined,
): string[] {
  if (!variant) return [prefix];
  if (variant === 'link') return [`${prefix}-link`];

  const dash = variant.indexOf('-');
  const head = dash === -1 ? variant : variant.slice(0, dash);
  let style = 'solid';
  let theme: string = variant;
  if (BUTTON_STYLES.includes(head)) {
    style = head;
    theme = dash === -1 ? '' : variant.slice(dash + 1);
  }

  return [
    style === 'styled' ? `${prefix}-solid` : `${prefix}-${style}`,
    style === 'styled' && `${prefix}-styled`,
    theme && `theme-${theme}`,
  ].filter(Boolean) as string[];
}

export interface ButtonProps extends BaseButtonProps {
  /**
   * @default 'btn'
   */
  bsPrefix?: string | undefined;

  /**
   * Manually set the visual state of the button to `:active`
   */
  active?: boolean | undefined;

  /**
   * The button style and theme color.
   *
   * A theme color alone renders a solid button:
   *
   * `'primary', 'accent', 'secondary', 'success', 'danger', 'warning', 'info', 'inverse'`
   *
   * Prefix the theme color with a style for the other variants:
   *
   * `'outline-primary', 'subtle-primary', 'text-primary', 'styled-primary'`
   *
   * Use `'link'` for a button that looks like a link.
   */
  variant?: ButtonVariant | undefined;

  /**
   * Specifies an extra small, small or large button.
   *
   * @type {'xs' | 'sm' | 'lg'}
   */
  size?: 'xs' | 'sm' | 'lg' | undefined;

  /**
   * Disables the Button, preventing mouse events,
   * even if the underlying component is an `<a>` element
   */
  disabled?: boolean | undefined;

  /**
   * Providing a `href` will render an `<a>` element, _styled_ as a button.
   */
  href?: string | undefined;
}

export type CommonButtonProps = 'href' | 'size' | 'variant' | 'disabled';

const Button: DynamicRefForwardingComponent<'button', ButtonProps> =
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        as,
        bsPrefix,
        variant = 'primary',
        size,
        active = false,
        disabled = false,
        className,
        ...props
      },
      ref,
    ) => {
      const prefix = useBootstrapPrefix(bsPrefix, 'btn');
      const [buttonProps, { tagName }] = useButtonProps({
        tagName: as,
        disabled,
        ...props,
      });

      const Component = tagName as React.ElementType;

      return (
        <Component
          {...buttonProps}
          {...props}
          ref={ref}
          disabled={disabled}
          className={clsx(
            className,
            ...getButtonVariantClasses(prefix, variant),
            active && 'active',
            size && `${prefix}-${size}`,
            props.href && disabled && 'disabled',
          )}
        />
      );
    },
  );

Button.displayName = 'Button';

export default Button;
