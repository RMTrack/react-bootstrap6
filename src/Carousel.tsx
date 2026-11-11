import useEventCallback from '@restart/hooks/useEventCallback';
import useUpdateEffect from '@restart/hooks/useUpdateEffect';
import type { DynamicRefForwardingComponent } from '@restart/ui/types';
import clsx from 'clsx';
import * as React from 'react';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useUncontrolled } from 'uncontrollable';
import CarouselItem from './CarouselItem.js';
import { map, forEach } from './ElementChildren.js';
import { useBootstrapPrefix, useIsRTL } from './ThemeProvider.js';
import transitionEndListener from './transitionEndListener.js';
import type { LiteralUnion } from './types.js';

export type CarouselVariant = LiteralUnion<'dark', string>;

export interface CarouselRef {
  element?: HTMLElement | null;
  prev: (e?: React.SyntheticEvent) => void;
  next: (e?: React.SyntheticEvent) => void;
}

export interface CarouselProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'onSelect'
> {
  /**
   * Element used to render the component.
   */
  as?: React.ElementType | undefined;

  /**
   * @default 'carousel'
   */
  bsPrefix?: string | undefined;

  /**
   * Animate the scroll between slides. When `false` the carousel jumps to
   * the slide.
   */
  slide?: boolean | undefined;

  /**
   * Animates slides with a crossfade animation instead of the default slide animation.
   */
  fade?: boolean | undefined;

  /**
   * Overlay the controls and indicators on top of the slides
   * (`.carousel-overlay`). When `false` they are laid out below the slides.
   */
  overlay?: boolean | undefined;

  /**
   * Show the Carousel previous and next arrows for changing the current slide.
   */
  controls?: boolean | undefined;

  /**
   * Show a set of slide position indicators.
   */
  indicators?: boolean | undefined;

  /**
   * An array of labels for the indicators. Defaults to "Slide #" if not provided.
   */
  indicatorLabels?: string[] | undefined;

  /**
   * Controls the current visible slide.
   *
   * @controllable onSelect
   */
  activeIndex?: number | undefined;

  /**
   * The default active index that is shown when the component is first rendered.
   */
  defaultActiveIndex?: number | undefined;

  /**
   * Callback fired when the active item changes.
   *
   * ```js
   * (eventKey: number, event: Object | null) => void
   * ```
   *
   * @type {((eventKey: number, event: Record<string, unknown> | null) => void) | undefined}
   * @controllable activeIndex
   */
  onSelect?:
    | ((eventKey: number, event: Record<string, unknown> | null) => void)
    | undefined;

  /**
   * Callback fired when a slide transition starts.
   *
   * @type {((eventKey: number, direction: 'start' | 'end') => void) | undefined}
   */
  onSlide?:
    ((eventKey: number, direction: 'start' | 'end') => void) | undefined;

  /**
   * Callback fired when a slide transition ends.
   *
   * @type {((eventKey: number, direction: 'start' | 'end') => void) | undefined}
   */
  onSlid?: ((eventKey: number, direction: 'start' | 'end') => void) | undefined;

  /**
   * Automatically cycle through the slides every `interval`. As in Bootstrap 6
   * this is opt-in, and any interaction with the carousel (controls,
   * indicators, keyboard, swiping) stops it for good.
   */
  autoplay?: boolean | undefined;

  /**
   * The amount of time to delay between automatically cycling an item. If `null`, carousel will not automatically cycle.
   */
  interval?: number | null | undefined;

  /**
   * Whether the carousel should react to keyboard events.
   */
  keyboard?: boolean | undefined;

  /**
   * If set to `"hover"`, pauses autoplay while the pointer is over the
   * carousel. If set to `false`, hovering over the carousel won't pause it.
   */
  pause?: 'hover' | false | undefined;

  /**
   * Whether the carousel should cycle continuously or have hard stops. Without
   * wrapping, the controls are disabled at either end.
   */
  wrap?: boolean | undefined;

  /**
   * Override the default button icon for the "previous" control.
   */
  prevIcon?: React.ReactNode | undefined;

  /**
   * Label shown to screen readers only, can be used to show the previous element in the carousel.
   * Set to null to deactivate.
   */
  prevLabel?: React.ReactNode | undefined;

  /**
   * Override the default button icon for the "next" control
   */
  nextIcon?: React.ReactNode | undefined;

  /**
   * Label shown to screen readers only, can be used to show the next element in the carousel.
   * Set to null to deactivate.
   */
  nextLabel?: React.ReactNode | undefined;

  /**
   * Color variant of the controls and indicators. `dark` renders the
   * carousel with `data-bs-theme="dark"`.
   */
  variant?: CarouselVariant | undefined;

  /**
   * Carousel ref.
   */
  ref?: React.Ref<CarouselRef> | undefined;
}

// The direction the slides move: 'start' when going to the next slide,
// 'end' when going back.
type Direction = 'start' | 'end';

// How long the scroll position must be still before a slide is "settled".
const SCROLL_SETTLE_DELAY = 100;
// Duration (ms) of a programmatic slide, as in Bootstrap's carousel.
const SCROLL_DURATION = 300;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/**
 * Scrolls the carousel viewport to `targetLeft`, then calls `onComplete`.
 *
 * Like Bootstrap's carousel plugin, snapping is suspended while scrolling and
 * the position is stepped each frame: the slides' `scroll-snap-stop: always`
 * would otherwise stop a smooth scroll at the first slide it passes, which
 * breaks multi-slide jumps (indicators, wrapping from the last slide).
 */
function scrollViewport(
  viewport: HTMLElement,
  targetLeft: number,
  animate: boolean,
  onComplete: () => void,
): () => void {
  let frame: number | null = null;
  viewport.style.scrollSnapType = 'none';
  const restoreSnap = () => {
    viewport.style.scrollSnapType = '';
  };
  // `instant` also overrides the CSS `scroll-behavior: smooth`.
  const jumpTo = (left: number) =>
    viewport.scrollTo({ left, top: 0, behavior: 'instant' });

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (
    !animate ||
    prefersReducedMotion ||
    typeof requestAnimationFrame === 'undefined'
  ) {
    jumpTo(targetLeft);
    restoreSnap();
    onComplete();
    return () => {};
  }

  const startLeft = viewport.scrollLeft;
  const distance = targetLeft - startLeft;
  let startTime: number | null = null;

  const step = (now: number) => {
    if (startTime === null) startTime = now;
    const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
    jumpTo(startLeft + distance * easeInOutCubic(progress));

    if (progress < 1) {
      frame = requestAnimationFrame(step);
      return;
    }

    frame = null;
    // Land exactly on the target, guarding against floating-point drift.
    jumpTo(targetLeft);
    restoreSnap();
    onComplete();
  };
  frame = requestAnimationFrame(step);

  return () => {
    if (frame !== null) cancelAnimationFrame(frame);
    restoreSnap();
  };
}

/**
 * Bootstrap 6's carousel is built on CSS scroll snap: `.carousel-inner` is a
 * horizontal scroll container. Navigating scrolls it to the active slide, and
 * scrolling it natively (swipe, trackpad) updates the active slide.
 */
const Carousel: DynamicRefForwardingComponent<'div', CarouselProps> =
  React.forwardRef<CarouselRef, CarouselProps>(
    ({ ...uncontrolledProps }, ref) => {
      const {
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'div',
        bsPrefix,
        slide = true,
        fade = false,
        overlay = true,
        controls = true,
        indicators = true,
        indicatorLabels = [],
        activeIndex = 0,
        onSelect,
        onSlide,
        onSlid,
        autoplay = false,
        interval = 5000,
        keyboard = true,
        onKeyDown,
        pause = 'hover',
        onMouseEnter,
        onMouseLeave,
        wrap = true,
        prevIcon = <span aria-hidden="true" className="carousel-icon-prev" />,
        prevLabel = 'Previous',
        nextIcon = <span aria-hidden="true" className="carousel-icon-next" />,
        nextLabel = 'Next',
        variant,
        className,
        style,
        children,
        ...props
      } = useUncontrolled(
        { defaultActiveIndex: 0, ...uncontrolledProps },
        {
          activeIndex: 'onSelect',
        },
      );

      const prefix = useBootstrapPrefix(bsPrefix, 'carousel');
      const isRTL = useIsRTL();

      const elementRef = useRef<HTMLElement>(null);
      const innerRef = useRef<HTMLDivElement>(null);

      let numChildren = 0;
      let activeChildInterval: number | undefined;
      forEach(children, (child, index) => {
        ++numChildren;
        if (index === activeIndex) {
          activeChildInterval = child.props.interval as number | undefined;
        }
      });

      const renderedActiveIndex = Math.max(
        0,
        Math.min(activeIndex, numChildren - 1),
      );

      // -- Navigation --------------------------------------------------------

      const [isSliding, setIsSliding] = useState(false);
      // Read by `select`, which can run before a re-render picks up
      // `isSliding` (slides finish in an animation frame).
      const isSlidingRef = useRef(false);
      const directionRef = useRef<Direction>('start');
      const programmaticScrollRef = useRef(false);

      // Autoplay stops for good once the user interacts with the carousel.
      const [autoplayStopped, setAutoplayStopped] = useState(false);
      const stopAutoplay = useCallback(() => setAutoplayStopped(true), []);

      const select = useEventCallback(
        (index: number, direction: Direction, event?: any) => {
          if (isSlidingRef.current || index === renderedActiveIndex) return;
          directionRef.current = direction;
          onSelect?.(index, event);
        },
      );

      const prev = useEventCallback((event?) => {
        let index = renderedActiveIndex - 1;
        if (index < 0) {
          if (!wrap) return;
          index = numChildren - 1;
        }
        select(index, 'end', event);
      });

      const next = useEventCallback((event?) => {
        let index = renderedActiveIndex + 1;
        if (index >= numChildren) {
          if (!wrap) return;
          index = 0;
        }
        select(index, 'start', event);
      });

      useImperativeHandle(ref, () => ({
        element: elementRef.current,
        prev,
        next,
      }));

      const getItems = () =>
        Array.from(innerRef.current?.children ?? []) as HTMLElement[];

      // Bring the active slide into view whenever it changes.
      useUpdateEffect(() => {
        const index = renderedActiveIndex;
        const direction = directionRef.current;
        directionRef.current = 'start';

        isSlidingRef.current = true;
        setIsSliding(true);
        onSlide?.(index, direction);

        let done = false;
        let cancelScroll: (() => void) | undefined;
        const finish = () => {
          if (done) return;
          done = true;
          programmaticScrollRef.current = false;
          isSlidingRef.current = false;
          setIsSliding(false);
          onSlid?.(index, direction);
        };

        const inner = innerRef.current;
        const item = getItems()[index];

        if (fade) {
          // The crossfade is a CSS opacity transition on the items.
          if (item) transitionEndListener(item, finish);
          else finish();
        } else if (inner && item) {
          const delta =
            item.getBoundingClientRect().left -
            inner.getBoundingClientRect().left;

          if (Math.abs(delta) < 1) {
            finish();
          } else {
            // Keeps the scroll events of this navigation from being read as
            // the user scrolling.
            programmaticScrollRef.current = true;
            cancelScroll = scrollViewport(
              inner,
              inner.scrollLeft + delta,
              slide,
              finish,
            );
          }
        } else {
          finish();
        }

        return () => {
          done = true;
          programmaticScrollRef.current = false;
          isSlidingRef.current = false;
          cancelScroll?.();
        };
      }, [renderedActiveIndex]);

      // Native scrolling (swipe, trackpad, scrollbar) picks the slide that
      // settles at the start of the viewport.
      const settleTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
      useEffect(() => () => clearTimeout(settleTimeoutRef.current!), []);

      const handleScrollSettled = useEventCallback(() => {
        if (programmaticScrollRef.current) return;

        const inner = innerRef.current;
        if (!inner || fade) return;

        const innerLeft = inner.getBoundingClientRect().left;
        let closest = renderedActiveIndex;
        let closestDistance = Infinity;
        getItems().forEach((item, index) => {
          const distance = Math.abs(
            item.getBoundingClientRect().left - innerLeft,
          );
          if (distance < closestDistance) {
            closest = index;
            closestDistance = distance;
          }
        });

        if (closest !== renderedActiveIndex) {
          stopAutoplay();
          select(closest, closest > renderedActiveIndex ? 'start' : 'end');
        }
      });

      const handleScroll = () => {
        clearTimeout(settleTimeoutRef.current!);
        settleTimeoutRef.current = setTimeout(
          handleScrollSettled,
          SCROLL_SETTLE_DELAY,
        );
      };

      // -- Interaction -------------------------------------------------------

      const handlePrevClick = (e: React.MouseEvent) => {
        stopAutoplay();
        prev(e);
      };

      const handleNextClick = (e: React.MouseEvent) => {
        stopAutoplay();
        next(e);
      };

      const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);

        if (
          !keyboard ||
          event.defaultPrevented ||
          /input|textarea/i.test((event.target as HTMLElement).tagName)
        ) {
          return;
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          stopAutoplay();
          if ((event.key === 'ArrowLeft') !== isRTL) prev(event);
          else next(event);
        }
      };

      const [isHovered, setIsHovered] = useState(false);

      const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        if (pause === 'hover') setIsHovered(true);
        onMouseEnter?.(event);
      };

      const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
        setIsHovered(false);
        onMouseLeave?.(event);
      };

      // -- Autoplay ----------------------------------------------------------

      const isPlaying =
        autoplay && interval != null && !autoplayStopped && numChildren > 1;
      const activeInterval = activeChildInterval ?? interval ?? 0;

      const nextWhenVisible = useEventCallback(() => {
        if (
          !document.hidden &&
          elementRef.current &&
          elementRef.current.offsetParent !== null
        ) {
          next();
        }
      });

      useEffect(() => {
        if (!isPlaying || isHovered || isSliding) return undefined;

        const timer = setTimeout(nextWhenVisible, activeInterval);
        return () => clearTimeout(timer);
      }, [
        isPlaying,
        isHovered,
        isSliding,
        activeInterval,
        renderedActiveIndex,
        nextWhenVisible,
      ]);

      // -- Render ------------------------------------------------------------

      const handleIndicatorClick = (index: number, event: React.MouseEvent) => {
        stopAutoplay();
        select(index, index > renderedActiveIndex ? 'start' : 'end', event);
      };

      const controlClassName = clsx(
        'btn-icon btn-sm',
        overlay && 'btn-subtle theme-secondary',
      );

      const prevControl = controls && (
        <button
          type="button"
          className={controlClassName}
          onClick={handlePrevClick}
          disabled={!wrap && renderedActiveIndex === 0}
        >
          {prevIcon}
          {prevLabel && <span className="visually-hidden">{prevLabel}</span>}
        </button>
      );

      const nextControl = controls && (
        <button
          type="button"
          className={controlClassName}
          onClick={handleNextClick}
          disabled={!wrap && renderedActiveIndex === numChildren - 1}
        >
          {nextIcon}
          {nextLabel && <span className="visually-hidden">{nextLabel}</span>}
        </button>
      );

      const indicatorList = indicators && (
        <div className={`${prefix}-indicators`}>
          {map(children, (_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="" // Bootstrap requires this in their css.
              aria-label={
                indicatorLabels?.length
                  ? indicatorLabels[index]
                  : `Slide ${index + 1}`
              }
              className={index === renderedActiveIndex ? 'active' : undefined}
              onClick={(event) => handleIndicatorClick(index, event)}
              aria-current={index === renderedActiveIndex}
            />
          ))}
        </div>
      );

      return (
        <Component
          ref={elementRef}
          {...props}
          data-bs-theme={variant}
          style={{
            ...style,
            ...(isPlaying && {
              '--bs-carousel-interval': `${activeInterval}ms`,
            }),
          }}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={clsx(
            className,
            prefix,
            fade && `${prefix}-fade`,
            overlay && `${prefix}-overlay`,
            isPlaying && `${prefix}-playing`,
          )}
        >
          <div
            ref={innerRef}
            className={`${prefix}-inner`}
            onScroll={handleScroll}
          >
            {map(children, (child, index) =>
              React.cloneElement(child, {
                className: clsx(
                  child.props.className,
                  index === renderedActiveIndex && 'active',
                ),
              }),
            )}
          </div>

          {(controls || indicators) && (
            <div
              className={
                overlay
                  ? `${prefix}-overlay-controls`
                  : 'd-flex align-items-center justify-content-between gap-2'
              }
            >
              {prevControl}
              {indicatorList}
              {nextControl}
            </div>
          )}
        </Component>
      );
    },
  );

Carousel.displayName = 'Carousel';

export default Object.assign(Carousel, {
  Item: CarouselItem,
});
