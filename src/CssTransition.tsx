import clsx from 'clsx';
import * as React from 'react';
import { Transition, type TransitionStatus } from 'react-transition-group';
import { getChildRef } from '@restart/ui/utils';
import transitionEndListener from './transitionEndListener.js';
import TransitionWrapper from './TransitionWrapper.js';
import type { TransitionCallbacks } from './types.js';

export interface CssTransitionProps extends TransitionCallbacks {
  className?: string;

  /**
   * Show the component; triggers the enter or exit transition.
   */
  in?: boolean | undefined;

  mountOnEnter?: boolean | undefined;

  unmountOnExit?: boolean | undefined;

  appear?: boolean | undefined;

  /**
   * Duration of the animation in milliseconds, to ensure that finishing
   * callbacks are fired even if the original browser transition end events
   * are canceled.
   */
  timeout?: number | undefined;

  children: React.ReactElement;
}

/**
 * Bootstrap 6 components declare their own transitions in CSS (entry
 * animations use `@starting-style`), so a transition only needs to toggle a
 * state class and wait for `transitionend`.
 */
export function createCssTransition(
  displayName: string,
  statusClasses: Partial<Record<TransitionStatus, string>>,
) {
  const Component = React.forwardRef<Transition<any>, CssTransitionProps>(
    ({ className, children, ...rest }, ref) => {
      const props = {
        in: false,
        timeout: 300,
        mountOnEnter: false,
        unmountOnExit: false,
        appear: false,
        ...rest,
      };

      return (
        <TransitionWrapper
          ref={ref}
          addEndListener={transitionEndListener}
          {...props}
          childRef={getChildRef(children)}
        >
          {(status: TransitionStatus, innerProps: Record<string, unknown>) =>
            React.cloneElement(children as any, {
              ...innerProps,
              className: clsx(
                className,
                (children.props as any).className,
                statusClasses[status],
              ),
            })
          }
        </TransitionWrapper>
      );
    },
  );
  Component.displayName = displayName;
  return Component;
}

/**
 * Adds `.show` while entering and entered (Toast, Tooltip, Popover, TabPane).
 */
export const ShowTransition = createCssTransition('ShowTransition', {
  entering: 'show',
  entered: 'show',
});

/**
 * Components that are visible as rendered and only animate out get `.hiding`
 * for the length of the exit transition (Alert).
 */
export const HidingTransition = createCssTransition('HidingTransition', {
  exiting: 'hiding',
  exited: 'hiding',
});
