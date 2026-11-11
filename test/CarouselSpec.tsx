import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Carousel, { CarouselRef } from '../src/Carousel';
import ThemeProvider from '../src/ThemeProvider';

describe('<Carousel>', () => {
  const CarouselItemTestId = 'carousel-item-test';

  const items = [
    <Carousel.Item key={1} data-testid={CarouselItemTestId}>
      Item 1 content
    </Carousel.Item>,
    <Carousel.Item key={2} data-testid={CarouselItemTestId}>
      Item 2 content
    </Carousel.Item>,
    <Carousel.Item key={3} data-testid={CarouselItemTestId}>
      Item 3 content
    </Carousel.Item>,
  ];

  const getIndicator = (label: string) =>
    screen.getByLabelText(label, { selector: '.carousel-indicators button' });

  it('should not throw an error with StrictMode', () => {
    const ref = React.createRef<CarouselRef>();

    render(
      <React.StrictMode>
        <Carousel ref={ref} interval={null}>
          {items}
        </Carousel>
      </React.StrictMode>,
    );

    act(() => {
      ref.current!.next();
    });
  });

  it('should render Bootstrap 6 markup', () => {
    const { container } = render(<Carousel>{items}</Carousel>);
    const carousel = container.firstElementChild!;

    expect(carousel.className).toEqual('carousel carousel-overlay');
    expect(carousel.classList).not.toContain('slide');

    const inner = carousel.querySelector('.carousel-inner')!;
    expect(inner.children).toHaveLength(items.length);

    const controls = carousel.querySelector('.carousel-overlay-controls')!;
    const [prev, indicators, next] = Array.from(controls.children);
    expect(prev.tagName).toEqual('BUTTON');
    expect(prev.querySelector('.carousel-icon-prev')).toBeTruthy();
    expect(indicators.classList).toContain('carousel-indicators');
    expect(next.tagName).toEqual('BUTTON');
    expect(next.querySelector('.carousel-icon-next')).toBeTruthy();

    expect(carousel.querySelector('.carousel-control-prev')).toBeNull();
    expect(carousel.querySelector('.carousel-control-next')).toBeNull();
  });

  it('should lay out controls below the slides when overlay is false', () => {
    const { container } = render(<Carousel overlay={false}>{items}</Carousel>);
    const carousel = container.firstElementChild!;

    expect(carousel.classList).not.toContain('carousel-overlay');
    expect(carousel.querySelector('.carousel-overlay-controls')).toBeNull();
    expect(carousel.lastElementChild!.querySelectorAll('button')).toHaveLength(
      items.length + 2,
    );
  });

  it('should show the first item by default and render all', () => {
    render(<Carousel>{items}</Carousel>);

    const carouselItems = screen.getAllByTestId(CarouselItemTestId);
    expect(carouselItems[0].classList).toContain('active');
    expect(carouselItems[1].classList).not.toContain('active');
    expect(carouselItems).toHaveLength(items.length);
  });

  it('should show the correct item with defaultActiveIndex', () => {
    render(<Carousel defaultActiveIndex={1}>{items}</Carousel>);

    const carouselItems = screen.getAllByTestId(CarouselItemTestId);
    expect(carouselItems[0].classList).not.toContain('active');
    expect(carouselItems[1].classList).toContain('active');
  });

  it('should handle falsy children', () => {
    render(
      <Carousel>
        {null}
        <Carousel.Item data-testid={CarouselItemTestId}>
          Item 1 content
        </Carousel.Item>
        {null}
        {false}
        <Carousel.Item data-testid={CarouselItemTestId}>
          Item 2 content
        </Carousel.Item>
      </Carousel>,
    );

    const carouselItems = screen.getAllByTestId(CarouselItemTestId);
    expect(carouselItems[0].classList).toContain('active');
    expect(carouselItems).toHaveLength(2);
    expect(
      screen.getAllByLabelText(/Slide/, {
        selector: '.carousel-indicators > button',
      }),
    ).toHaveLength(2);
  });

  it('should call onSelect when indicator selected', () => {
    const onSelect = vi.fn();

    render(
      <Carousel activeIndex={1} onSelect={onSelect} interval={null}>
        {items}
      </Carousel>,
    );

    fireEvent.click(getIndicator('Slide 1'));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(0, expect.anything());
  });

  it('should mark the active indicator', () => {
    render(<Carousel defaultActiveIndex={1}>{items}</Carousel>);

    const indicator = getIndicator('Slide 2');
    expect(indicator.classList).toContain('active');
    expect(indicator.getAttribute('aria-current')).toEqual('true');
    // Bootstrap styles indicators through [data-bs-target].
    expect(indicator.hasAttribute('data-bs-target')).toEqual(true);
  });

  it('should render custom indicator labels', () => {
    const labels = ['custom1', 'custom2', 'custom3'];

    render(
      <Carousel activeIndex={1} interval={null} indicatorLabels={labels}>
        {items}
      </Carousel>,
    );

    labels.forEach((label) => {
      expect(getIndicator(label)).toBeDefined();
    });
  });

  it('should render variant', () => {
    render(
      <Carousel
        activeIndex={1}
        interval={null}
        variant="dark"
        data-testid="test"
      >
        {items}
      </Carousel>,
    );

    const carousel = screen.getByTestId('test');
    // Bootstrap 6 dropped .carousel-dark in favor of color modes.
    expect(carousel.classList).not.toContain('carousel-dark');
    expect(carousel.getAttribute('data-bs-theme')).toEqual('dark');
  });

  it('should render correctly when fade is set', () => {
    render(
      <Carousel defaultActiveIndex={1} fade data-testid="test">
        {items}
      </Carousel>,
    );

    expect(screen.getByTestId('test').classList).toContain('carousel-fade');
  });

  describe('ref testing', () => {
    it('should allow refs to be attached and expose next, prev functions', async () => {
      const ref = React.createRef<CarouselRef>();
      const onSelectSpy = vi.fn();
      const onSlidSpy = vi.fn();

      render(
        <Carousel
          ref={ref}
          onSelect={onSelectSpy}
          onSlid={onSlidSpy}
          defaultActiveIndex={1}
        >
          {items}
        </Carousel>,
      );

      expect(ref.current).toHaveProperty('next');
      expect(ref.current).toHaveProperty('prev');
      expect(ref.current!.element).toBeInstanceOf(HTMLElement);

      act(() => {
        ref.current!.next();
      });

      await waitFor(() => expect(onSelectSpy).toHaveBeenCalledOnce());
      await waitFor(() => expect(onSlidSpy).toHaveBeenCalledWith(2, 'start'));

      act(() => {
        ref.current!.prev();
      });

      await waitFor(() => expect(onSelectSpy).toHaveBeenCalledTimes(2));
      await waitFor(() => expect(onSlidSpy).toHaveBeenCalledWith(1, 'end'));
    });
  });

  it('should call onSlide with previous index and direction', () => {
    const onEventSpy = vi.fn();

    render(
      <Carousel defaultActiveIndex={1} interval={null} onSlide={onEventSpy}>
        {items}
      </Carousel>,
    );

    fireEvent.click(getIndicator('Slide 1'));

    expect(onEventSpy).toHaveBeenCalledWith(0, 'end');
  });

  it('should call onSlide with next index and direction', () => {
    const onEventSpy = vi.fn();

    render(
      <Carousel defaultActiveIndex={1} interval={null} onSlide={onEventSpy}>
        {items}
      </Carousel>,
    );

    fireEvent.click(getIndicator('Slide 3'));

    expect(onEventSpy).toHaveBeenCalledWith(items.length - 1, 'start');
  });

  it('should call onSlid with previous index and direction', async () => {
    const onEventSpy = vi.fn();

    render(
      <Carousel defaultActiveIndex={1} interval={null} onSlid={onEventSpy}>
        {items}
      </Carousel>,
    );

    fireEvent.click(getIndicator('Slide 1'));

    await waitFor(() => expect(onEventSpy).toHaveBeenCalledWith(0, 'end'));
  });

  it('should call onSlid with next index and direction', async () => {
    const onEventSpy = vi.fn();

    render(
      <Carousel defaultActiveIndex={1} interval={null} onSlid={onEventSpy}>
        {items}
      </Carousel>,
    );

    fireEvent.click(getIndicator('Slide 3'));

    await waitFor(() =>
      expect(onEventSpy).toHaveBeenCalledWith(items.length - 1, 'start'),
    );
  });

  describe('controls with and without wrapping', () => {
    it('should enable the prev control on the first slide if wrap is true', () => {
      render(<Carousel defaultActiveIndex={0}>{items}</Carousel>);

      expect(screen.getByText('Previous').closest('button')!.disabled).toEqual(
        false,
      );
    });

    it('should disable the prev control on the first slide if wrap is false', () => {
      render(
        <Carousel defaultActiveIndex={0} wrap={false}>
          {items}
        </Carousel>,
      );

      expect(screen.getByText('Previous').closest('button')!.disabled).toEqual(
        true,
      );
      expect(screen.getByText('Next').closest('button')!.disabled).toEqual(
        false,
      );
    });

    it('should disable the next control on the last slide if wrap is false', () => {
      render(
        <Carousel defaultActiveIndex={items.length - 1} wrap={false}>
          {items}
        </Carousel>,
      );

      expect(screen.getByText('Next').closest('button')!.disabled).toEqual(
        true,
      );
    });

    it('should not render controls when controls is false', () => {
      render(<Carousel controls={false}>{items}</Carousel>);

      expect(screen.queryByText('Previous')).toBeNull();
      expect(screen.queryByText('Next')).toBeNull();
    });
  });

  it('should allow the user to specify a previous and next icon', () => {
    render(
      <Carousel
        controls
        indicators={false}
        prevIcon={<span className="ficon ficon-left" />}
        nextIcon={<span className="ficon ficon-right" />}
      >
        {items}
      </Carousel>,
    );

    expect(document.querySelector('.ficon-left')).toBeTruthy();
    expect(document.querySelector('.ficon-right')).toBeTruthy();
  });

  it('should allow user to specify a previous and next SR label', () => {
    render(
      <Carousel
        controls
        indicators={false}
        prevLabel="Previous awesomeness"
        nextLabel="Next awesomeness"
      >
        {items}
      </Carousel>,
    );

    expect(screen.getByText('Previous awesomeness').className).toEqual(
      'visually-hidden',
    );
    expect(screen.getByText('Next awesomeness')).toBeDefined();
  });

  it('should not render labels when values are null or undefined', () => {
    render(
      <Carousel controls indicators={false} prevLabel={null} nextLabel="">
        {items}
      </Carousel>,
    );

    expect(document.querySelectorAll('.visually-hidden')).toHaveLength(0);
  });

  it('should render on update, active item > new child length', () => {
    const { rerender } = render(
      <Carousel defaultActiveIndex={items.length - 1}>{items}</Carousel>,
    );

    const fewerItems = items.slice(2);

    rerender(
      <Carousel defaultActiveIndex={items.length - 1}>{fewerItems}</Carousel>,
    );

    const carouselItems = screen.getAllByTestId(CarouselItemTestId);
    expect(carouselItems).toHaveLength(fewerItems.length);
    expect(carouselItems[0].classList).toContain('active');
  });

  describe('scrolling', () => {
    // A minimal stand-in for Bootstrap's scroll-snap layout, including its
    // `scroll-snap-stop: always`.
    const layout = (
      <style>{`
        .carousel-inner { display: flex; width: 100px; overflow-x: auto; scrollbar-width: none; scroll-snap-type: x mandatory; }
        .carousel-item { flex: 0 0 100%; height: 50px; scroll-snap-align: start; scroll-snap-stop: always; }
      `}</style>
    );

    it('should jump several slides at once', async () => {
      const onSlid = vi.fn();
      const { container } = render(
        <>
          {layout}
          <Carousel defaultActiveIndex={0} onSlid={onSlid}>
            {items}
          </Carousel>
        </>,
      );
      const inner = container.querySelector<HTMLElement>('.carousel-inner')!;

      fireEvent.click(getIndicator('Slide 3'));

      await waitFor(() => expect(onSlid).toHaveBeenCalledWith(2, 'start'));
      expect(Math.round(inner.scrollLeft)).toEqual(200);
      // Snapping is only suspended while scrolling.
      expect(inner.style.scrollSnapType).toEqual('');
    });

    it('should wrap from the last slide back to the first', async () => {
      const onSlid = vi.fn();
      const { container } = render(
        <>
          {layout}
          <Carousel defaultActiveIndex={0} onSlid={onSlid}>
            {items}
          </Carousel>
        </>,
      );
      const inner = container.querySelector<HTMLElement>('.carousel-inner')!;

      fireEvent.click(getIndicator('Slide 3'));
      await waitFor(() => expect(onSlid).toHaveBeenCalledWith(2, 'start'));

      fireEvent.click(screen.getByText('Next'));
      await waitFor(() => expect(onSlid).toHaveBeenCalledWith(0, 'start'));
      expect(Math.round(inner.scrollLeft)).toEqual(0);
      expect(screen.getAllByTestId(CarouselItemTestId)[0].classList).toContain(
        'active',
      );
    });

    it('should scroll the active slide into view', async () => {
      const onSlid = vi.fn();
      const { container, rerender } = render(
        <>
          {layout}
          <Carousel activeIndex={0} slide={false} onSlid={onSlid}>
            {items}
          </Carousel>
        </>,
      );
      const inner = container.querySelector<HTMLElement>('.carousel-inner')!;

      rerender(
        <>
          {layout}
          <Carousel activeIndex={2} slide={false} onSlid={onSlid}>
            {items}
          </Carousel>
        </>,
      );

      expect(inner.scrollLeft).toEqual(200);
      await waitFor(() => expect(onSlid).toHaveBeenCalledWith(2, 'start'));
    });

    (['Next', 'Previous'] as const).forEach((control) => {
      it(`should call onSelect once if ${control} is double clicked while sliding`, () => {
        const onSelectSpy = vi.fn();
        render(
          <>
            {layout}
            <Carousel onSelect={onSelectSpy}>{items}</Carousel>
          </>,
        );

        const button = screen.getByText(control);
        fireEvent.click(button);
        fireEvent.click(button);

        expect(onSelectSpy).toHaveBeenCalledOnce();
      });
    });

    it('should select the slide the user scrolls to', async () => {
      const onSelect = vi.fn();
      const { container } = render(
        <>
          {layout}
          <Carousel defaultActiveIndex={0} onSelect={onSelect}>
            {items}
          </Carousel>
        </>,
      );
      const inner = container.querySelector<HTMLElement>('.carousel-inner')!;

      inner.scrollTo({ left: 100, behavior: 'instant' });
      fireEvent.scroll(inner);

      await waitFor(() => expect(onSelect).toHaveBeenCalledWith(1, undefined));
      await waitFor(() =>
        expect(
          screen.getAllByTestId(CarouselItemTestId)[1].classList,
        ).toContain('active'),
      );
    });
  });

  describe('autoplay', () => {
    let clock: ReturnType<typeof vi.useFakeTimers>;

    beforeEach(() => {
      clock = vi.useFakeTimers();
    });

    afterEach(() => {
      clock.useRealTimers();
    });

    it('should not autoplay by default', () => {
      const onSelectSpy = vi.fn();

      render(
        <Carousel interval={500} onSelect={onSelectSpy}>
          {items}
        </Carousel>,
      );

      act(() => {
        clock.advanceTimersByTime(2000);
      });

      expect(onSelectSpy).not.toHaveBeenCalled();
    });

    it('should go through the items after given seconds', () => {
      const onSelectSpy = vi.fn();
      const interval = 500;

      render(
        <Carousel autoplay interval={interval} onSelect={onSelectSpy}>
          {items}
        </Carousel>,
      );

      act(() => {
        clock.advanceTimersByTime(interval * 1.5);
      });

      expect(onSelectSpy).toHaveBeenCalledOnce();
      expect(onSelectSpy).toHaveBeenCalledWith(1, undefined);
    });

    it('should go through the items given the specified intervals', () => {
      const onSelectSpy = vi.fn();
      render(
        <Carousel autoplay interval={5000} onSelect={onSelectSpy}>
          <Carousel.Item interval={1000}>Item 1 content</Carousel.Item>
          <Carousel.Item>Item 2 content</Carousel.Item>
        </Carousel>,
      );

      act(() => {
        clock.advanceTimersByTime(1100);
      });
      expect(onSelectSpy).toHaveBeenCalledOnce();
      expect(onSelectSpy).toHaveBeenCalledWith(1, undefined);
    });

    it('should mark the carousel as playing', () => {
      render(
        <Carousel autoplay interval={2000} data-testid="test">
          {items}
        </Carousel>,
      );

      const carousel = screen.getByTestId('test');
      expect(carousel.classList).toContain('carousel-playing');
      expect(carousel.style.getPropertyValue('--bs-carousel-interval')).toEqual(
        '2000ms',
      );
    });

    it('should not autoplay when interval is null', () => {
      const onSelectSpy = vi.fn();
      render(
        <Carousel autoplay interval={null} onSelect={onSelectSpy}>
          {items}
        </Carousel>,
      );

      act(() => {
        clock.advanceTimersByTime(10000);
      });

      expect(onSelectSpy).not.toHaveBeenCalled();
    });

    it('should pause on hover and continue afterwards', () => {
      const onSelectSpy = vi.fn();
      const interval = 500;

      render(
        <Carousel
          autoplay
          interval={interval}
          onSelect={onSelectSpy}
          data-testid="test"
        >
          {items}
        </Carousel>,
      );

      const carousel = screen.getByTestId('test');
      fireEvent.mouseEnter(carousel);

      act(() => {
        clock.advanceTimersByTime(interval * 2);
      });

      expect(onSelectSpy).not.toHaveBeenCalled();

      fireEvent.mouseLeave(carousel);

      act(() => {
        clock.advanceTimersByTime(interval * 1.5);
      });

      expect(onSelectSpy).toHaveBeenCalledOnce();
    });

    it('should ignore hover if pause is false', () => {
      const onSelectSpy = vi.fn();
      const interval = 500;

      render(
        <Carousel
          autoplay
          interval={interval}
          pause={false}
          onSelect={onSelectSpy}
          data-testid="test"
        >
          {items}
        </Carousel>,
      );

      fireEvent.mouseEnter(screen.getByTestId('test'));

      act(() => {
        clock.advanceTimersByTime(interval * 1.5);
      });

      expect(onSelectSpy).toHaveBeenCalledOnce();
    });

    it('should stop for good when the user interacts with the controls', () => {
      const onSelectSpy = vi.fn();
      const interval = 500;

      render(
        <Carousel
          autoplay
          interval={interval}
          onSelect={onSelectSpy}
          data-testid="test"
        >
          {items}
        </Carousel>,
      );

      fireEvent.click(screen.getByText('Next'));
      expect(onSelectSpy).toHaveBeenCalledOnce();
      expect(screen.getByTestId('test').classList).not.toContain(
        'carousel-playing',
      );

      act(() => {
        clock.advanceTimersByTime(interval * 10);
      });

      expect(onSelectSpy).toHaveBeenCalledOnce();
    });

    it('should stop going through the items after unmounting', () => {
      const onSelectSpy = vi.fn();
      const { unmount } = render(
        <Carousel autoplay interval={500} onSelect={onSelectSpy}>
          {items}
        </Carousel>,
      );

      unmount();

      act(() => {
        clock.advanceTimersByTime(1000);
      });

      expect(onSelectSpy).not.toHaveBeenCalled();
    });
  });

  describe('wrapping', () => {
    it('should wrap to last from first', () => {
      const onSelectSpy = vi.fn();

      render(
        <Carousel activeIndex={0} onSelect={onSelectSpy}>
          {items}
        </Carousel>,
      );

      fireEvent.click(screen.getByText('Previous'));

      expect(onSelectSpy).toHaveBeenCalledOnce();
      expect(onSelectSpy).toHaveBeenCalledWith(
        items.length - 1,
        expect.anything(),
      );
    });

    it('should wrap from last to first', () => {
      const onSelectSpy = vi.fn();

      render(
        <Carousel activeIndex={items.length - 1} onSelect={onSelectSpy}>
          {items}
        </Carousel>,
      );

      fireEvent.click(screen.getByText('Next'));

      expect(onSelectSpy).toHaveBeenCalledOnce();
      expect(onSelectSpy).toHaveBeenCalledWith(0, expect.anything());
    });

    it('should not wrap when wrap is false', () => {
      const onSelectSpy = vi.fn();
      const ref = React.createRef<CarouselRef>();

      render(
        <Carousel
          ref={ref}
          activeIndex={items.length - 1}
          wrap={false}
          onSelect={onSelectSpy}
        >
          {items}
        </Carousel>,
      );

      act(() => {
        ref.current!.next();
      });

      expect(onSelectSpy).not.toHaveBeenCalled();
    });
  });

  describe('keyboard events', () => {
    it('should go back for the keyboard event ArrowLeft', () => {
      const onSelectSpy = vi.fn();
      render(
        <Carousel activeIndex={1} onSelect={onSelectSpy} data-testid="test">
          {items}
        </Carousel>,
      );

      fireEvent.keyDown(screen.getByTestId('test'), { key: 'ArrowLeft' });

      expect(onSelectSpy).toHaveBeenCalledOnce();
      expect(onSelectSpy).toHaveBeenCalledWith(0, expect.anything());
    });

    it('should go forward for the keyboard event ArrowRight', () => {
      const onSelectSpy = vi.fn();
      render(
        <Carousel activeIndex={1} onSelect={onSelectSpy} data-testid="test">
          {items}
        </Carousel>,
      );

      fireEvent.keyDown(screen.getByTestId('test'), { key: 'ArrowRight' });

      expect(onSelectSpy).toHaveBeenCalledOnce();
      expect(onSelectSpy).toHaveBeenCalledWith(2, expect.anything());
    });

    it('should ignore keyEvents when the keyboard is disabled', () => {
      const onSelectSpy = vi.fn();
      render(
        <Carousel
          activeIndex={1}
          onSelect={onSelectSpy}
          keyboard={false}
          data-testid="test"
        >
          {items}
        </Carousel>,
      );

      fireEvent.keyDown(screen.getByTestId('test'), { key: 'ArrowRight' });

      expect(onSelectSpy).not.toHaveBeenCalled();
    });

    it('should handle a defined custom key event', () => {
      const onKeyDownSpy = vi.fn();
      render(
        <Carousel activeIndex={1} onKeyDown={onKeyDownSpy} data-testid="test">
          {items}
        </Carousel>,
      );

      fireEvent.keyDown(screen.getByTestId('test'), { key: 'ArrowRight' });

      expect(onKeyDownSpy).toHaveBeenCalledOnce();
    });

    ['ArrowUp', 'ArrowRightLeft', 'Onwards'].forEach((key) => {
      it(`should do nothing for the key ${key}`, () => {
        const onSelectSpy = vi.fn();
        render(
          <Carousel activeIndex={1} onSelect={onSelectSpy} data-testid="test">
            {items}
          </Carousel>,
        );

        fireEvent.keyDown(screen.getByTestId('test'), { key });

        expect(onSelectSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('mouse events', () => {
    it('should handle a defined mouse enter and leave event', () => {
      const onMouseEnterSpy = vi.fn();
      const onMouseLeaveSpy = vi.fn();

      render(
        <Carousel
          onMouseEnter={onMouseEnterSpy}
          onMouseLeave={onMouseLeaveSpy}
          data-testid="test"
        >
          {items}
        </Carousel>,
      );

      fireEvent.mouseEnter(screen.getByTestId('test'));
      fireEvent.mouseLeave(screen.getByTestId('test'));

      expect(onMouseEnterSpy).toHaveBeenCalledOnce();
      expect(onMouseLeaveSpy).toHaveBeenCalledOnce();
    });
  });

  describe('callback tests', () => {
    it('should call onSlide and onSlid when slide animation is disabled', async () => {
      const onSlideSpy = vi.fn();
      const onSlidSpy = vi.fn();

      render(
        <Carousel slide={false} onSlide={onSlideSpy} onSlid={onSlidSpy}>
          {items}
        </Carousel>,
      );

      fireEvent.click(screen.getByText('Next'));

      expect(onSlideSpy).toHaveBeenCalledWith(1, 'start');
      await waitFor(() => expect(onSlidSpy).toHaveBeenCalledWith(1, 'start'));
    });
  });

  describe('RTL', () => {
    it('should go forward on ArrowLeft when dir=rtl', () => {
      const onSelectSpy = vi.fn();

      render(
        <ThemeProvider dir="rtl">
          <Carousel activeIndex={1} onSelect={onSelectSpy} data-testid="test">
            {items}
          </Carousel>
        </ThemeProvider>,
      );

      fireEvent.keyDown(screen.getByTestId('test'), { key: 'ArrowLeft' });

      expect(onSelectSpy).toHaveBeenCalledOnce();
      expect(onSelectSpy).toHaveBeenCalledWith(2, expect.anything());
    });

    it('should go back on ArrowRight when dir=rtl', () => {
      const onSelectSpy = vi.fn();

      render(
        <ThemeProvider dir="rtl">
          <Carousel activeIndex={1} onSelect={onSelectSpy} data-testid="test">
            {items}
          </Carousel>
        </ThemeProvider>,
      );

      fireEvent.keyDown(screen.getByTestId('test'), { key: 'ArrowRight' });

      expect(onSelectSpy).toHaveBeenCalledOnce();
      expect(onSelectSpy).toHaveBeenCalledWith(0, expect.anything());
    });
  });
});
