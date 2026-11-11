import clsx from 'clsx';
import React from 'react';
import { Transition, type TransitionStatus } from 'react-transition-group';
import { getChildRef } from '@restart/ui/utils';
import transitionEndListener from './transitionEndListener.js';
import TransitionWrapper from './TransitionWrapper.js';
import type { TransitionCallbacks } from './types.js';

type Dimension = 'height' | 'width';

export interface CollapseProps
  extends
    TransitionCallbacks,
    Pick<React.HTMLAttributes<HTMLElement>, 'className' | 'role'> {
  /**
   * Show the component; triggers the expand or collapse animation
   */
  in?: boolean | undefined;

  /**
   * Wait until the first "enter" transition to mount the component (add it to the DOM)
   */
  mountOnEnter?: boolean | undefined;

  /**
   * Unmount the component (remove it from the DOM) when it is collapsed
   */
  unmountOnExit?: boolean | undefined;

  /**
   * Run the expand animation when the component mounts, if it is initially shown
   */
  appear?: boolean | undefined;

  /**
   * Duration of the collapse animation in milliseconds, to ensure that
   * finishing callbacks are fired even if the original browser transition end
   * events are canceled
   */
  timeout?: number | undefined;

  /**
   * The dimension used when collapsing, or a function that returns the
   * dimension. `width` adds `.collapse-horizontal`.
   *
   * @type {'height' | 'width' | (() => 'height' | 'width')  | undefined}
   */
  dimension?: Dimension | (() => Dimension) | undefined;

  /**
   * You must provide a single JSX child element to this component and that element cannot be a \<React.Fragment\>
   */
  children: React.ReactElement;
}

// Bootstrap 6 animates the size in CSS (`interpolate-size`): `.show` is the
// only state class, so it is removed as soon as the exit starts.
const collapseStyles: Record<TransitionStatus, string> = {
  unmounted: 'collapse',
  exited: 'collapse',
  exiting: 'collapse',
  entering: 'collapse show',
  entered: 'collapse show',
};

const Collapse = React.forwardRef<Transition<any>, CollapseProps>(
  (
    {
      className,
      children,
      dimension = 'height',
      in: inProp = false,
      timeout = 350,
      mountOnEnter = false,
      unmountOnExit = false,
      appear = false,
      ...props
    },
    ref,
  ) => {
    /* Compute dimension */
    const computedDimension =
      typeof dimension === 'function' ? dimension() : dimension;

    return (
      <TransitionWrapper
        ref={ref}
        addEndListener={transitionEndListener}
        {...props}
        aria-expanded={props.role ? inProp : null}
        childRef={getChildRef(children)}
        in={inProp}
        timeout={timeout}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        appear={appear}
      >
        {(state: TransitionStatus, innerProps: Record<string, unknown>) =>
          React.cloneElement(children as any, {
            ...innerProps,
            className: clsx(
              className,
              (children.props as any).className,
              collapseStyles[state],
              computedDimension === 'width' && 'collapse-horizontal',
            ),
          })
        }
      </TransitionWrapper>
    );
  },
);

Collapse.displayName = 'Collapse';

export default Collapse;
