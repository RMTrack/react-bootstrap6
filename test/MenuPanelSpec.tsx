import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Menu from '../src/Menu';
import MenuItem from '../src/MenuItem';
import MenuPanel, { getMenuPlacement } from '../src/MenuPanel';

describe('<Menu.Panel>', () => {
  it('renders div with menu class', () => {
    const { container } = render(
      <MenuPanel show>
        <MenuItem eventKey="1">Item 1</MenuItem>
        <MenuItem eventKey="2">Item 2</MenuItem>
        <MenuItem eventKey="3">Item 3</MenuItem>
        <MenuItem eventKey="4">Item 4</MenuItem>
      </MenuPanel>,
    );

    expect(container.firstElementChild!.classList).toContain('menu');
  });

  it('Should pass props to dropdown', () => {
    const { container } = render(
      <MenuPanel show className="new-fancy-class">
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
      </MenuPanel>,
    );

    expect(container.firstElementChild!.classList).toContain('new-fancy-class');
  });

  it('applies align="end" through the placement', () => {
    const { container } = render(
      <MenuPanel show align="end" flip={false}>
        <MenuItem>Item</MenuItem>
      </MenuPanel>,
    );

    const menu = container.firstElementChild!;
    expect(menu.className).toEqual('menu show');
    expect(menu.getAttribute('data-bs-placement')).toEqual('bottom-end');
  });

  it('renders on mount with prop', () => {
    const { container } = render(
      <MenuPanel renderOnMount>
        <MenuItem>Item</MenuItem>
      </MenuPanel>,
    );

    expect(container.firstElementChild!.classList).toContain('menu');
  });

  it('does not add any extra classes when align="start"', () => {
    const { container } = render(
      <MenuPanel show align="start">
        <MenuItem>Item</MenuItem>
      </MenuPanel>,
    );

    expect(container.firstElementChild!.className).toEqual('menu show');
  });

  // Bootstrap 6 has no responsive alignment classes; the placement is picked
  // from a media query (lg is 1024px in Bootstrap 6).
  const isLg = () => window.matchMedia('(min-width: 1024px)').matches;

  it('aligns responsively to the start from a breakpoint', () => {
    const { container } = render(
      <MenuPanel show align={{ lg: 'start' }} flip={false}>
        <MenuItem>Item</MenuItem>
      </MenuPanel>,
    );

    const menu = container.firstElementChild!;
    expect(menu.className).toEqual('menu show');
    expect(menu.getAttribute('data-bs-placement')).toEqual(
      isLg() ? 'bottom-start' : 'bottom-end',
    );
  });

  it('aligns responsively to the end from a breakpoint', () => {
    const { container } = render(
      <MenuPanel show align={{ lg: 'end' }} flip={false}>
        <MenuItem>Item</MenuItem>
      </MenuPanel>,
    );

    expect(
      container.firstElementChild!.getAttribute('data-bs-placement'),
    ).toEqual(isLg() ? 'bottom-end' : 'bottom-start');
  });

  it('ignores responsive alignment for unknown breakpoints', () => {
    const { container } = render(
      <MenuPanel show align={{ custom: 'end' }} flip={false}>
        <MenuItem>Item</MenuItem>
      </MenuPanel>,
    );

    expect(
      container.firstElementChild!.getAttribute('data-bs-placement'),
    ).toEqual('bottom-start');
  });

  it('should render variant', () => {
    const { container } = render(
      <MenuPanel show variant="dark">
        <MenuItem>Item</MenuItem>
      </MenuPanel>,
    );

    const menu = container.firstElementChild!;
    expect(menu.className).toEqual('menu show');
    expect(menu.getAttribute('data-bs-theme')).toEqual('dark');
  });

  it('does not flicker when rootCloseEvent is set to "mousedown" and toggle button is clicked', () => {
    const { container } = render(
      <Menu>
        <Menu.Toggle id="dropdown-basic" data-testid="dropdown-toggle">
          Menu Button
        </Menu.Toggle>
        <Menu.Panel rootCloseEvent="mousedown">
          <Menu.Item href="#/action-1">Action</Menu.Item>
        </Menu.Panel>
      </Menu>,
    );
    // Click the toggle button to open the menu
    fireEvent.click(screen.getByTestId('dropdown-toggle'));
    // The menu should now be in the DOM
    expect(container.firstElementChild!.classList).toContain('show');
    // Click the toggle button again to close the menu
    fireEvent.click(screen.getByTestId('dropdown-toggle'));
    // The menu should no longer be in the DOM
    expect(container.firstElementChild!.classList).not.toContain('show');
  });

  describe('getMenuPlacement', () => {
    it('should return top placement', () => {
      expect(getMenuPlacement(false, 'up', false)).toEqual('top-start');
      expect(getMenuPlacement(true, 'up', false)).toEqual('top-end');
      expect(getMenuPlacement(true, 'up-centered', false)).toEqual('top');
    });

    it('should return top placement for RTL', () => {
      expect(getMenuPlacement(false, 'up', true)).toEqual('top-end');
      expect(getMenuPlacement(true, 'up', true)).toEqual('top-start');
      expect(getMenuPlacement(true, 'up-centered', true)).toEqual('top');
    });

    it('should return end placement', () => {
      expect(getMenuPlacement(false, 'end', false)).toEqual('right-start');
      expect(getMenuPlacement(true, 'end', false)).toEqual('right-end');
    });

    it('should return end placement for RTL', () => {
      expect(getMenuPlacement(false, 'end', true)).toEqual('left-start');
      expect(getMenuPlacement(true, 'end', true)).toEqual('left-end');
    });

    it('should return bottom placement', () => {
      expect(getMenuPlacement(false, 'down', false)).toEqual('bottom-start');
      expect(getMenuPlacement(true, 'down', false)).toEqual('bottom-end');
      expect(getMenuPlacement(true, 'down-centered', false)).toEqual('bottom');
    });

    it('should return bottom placement for RTL', () => {
      expect(getMenuPlacement(false, 'down', true)).toEqual('bottom-end');
      expect(getMenuPlacement(true, 'down', true)).toEqual('bottom-start');
      expect(getMenuPlacement(true, 'down-centered', true)).toEqual('bottom');
    });

    it('should return start placement', () => {
      expect(getMenuPlacement(false, 'start', false)).toEqual('left-start');
      expect(getMenuPlacement(true, 'start', false)).toEqual('left-end');
    });

    it('should return start placement for RTL', () => {
      expect(getMenuPlacement(false, 'start', true)).toEqual('right-start');
      expect(getMenuPlacement(true, 'start', true)).toEqual('right-end');
    });
  });
});
