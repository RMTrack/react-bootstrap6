import clsx from 'clsx';
import * as React from 'react';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import { useBootstrapPrefix } from './ThemeProvider.js';
import type { Color, Variant } from './types.js';

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'badge'
   */
  bsPrefix?: string | undefined;

  /**
   * The theme color of the badge, applied with `.theme-*`.
   *
   * @type {'primary' | 'accent' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'inverse' | undefined}
   */
  bg?: Variant | undefined;

  /**
   * Render a subtle or outline badge instead of the default solid one.
   */
  variant?: 'subtle' | 'outline' | undefined;

  /**
   * Make badges more rounded with some additional horizontal padding
   */
  pill?: boolean | undefined;

  /**
   * Sets badge text color, applied with `.fg-*`
   *
   * @type {'primary' | 'accent' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'inverse' | 'body' | 'white' | 'black' | undefined}
   */
  text?: Color | undefined;
}

const Badge: DynamicRefForwardingComponent<'span', BadgeProps> =
  React.forwardRef<HTMLElement, BadgeProps>(
    (
      {
        bsPrefix,
        bg = 'primary',
        variant,
        pill = false,
        text,
        className,
        as: Component = 'span',
        ...props
      },
      ref,
    ) => {
      const prefix = useBootstrapPrefix(bsPrefix, 'badge');
      return (
        <Component
          ref={ref}
          {...props}
          className={clsx(
            className,
            prefix,
            variant && `${prefix}-${variant}`,
            pill && `rounded-pill`,
            text && `fg-${text}`,
            bg && `theme-${bg}`,
          )}
        />
      );
    },
  );

Badge.displayName = 'Badge';

export default Badge;
