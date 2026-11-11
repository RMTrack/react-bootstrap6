import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import MenuButton from '../src/MenuButton';
import MenuItem from '../src/MenuItem';

describe('<MenuButton>', () => {
  it('renders a toggle with the title prop', () => {
    render(
      <MenuButton title="Simple Menu" data-testid="test-id">
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
        <MenuItem>Item 4</MenuItem>
      </MenuButton>,
    );
    expect(screen.getByTestId('test-id').textContent).toEqual('Simple Menu');
  });

  it('renders single MenuItem child', () => {
    const { getByText } = render(
      <MenuButton defaultShow title="Single child">
        <MenuItem>Item 1</MenuItem>
      </MenuButton>,
    );
    expect(getByText('Item 1')).toBeDefined();
  });

  it('forwards align="end" to the Menu', () => {
    const { container } = render(
      <MenuButton defaultShow align="end" title="blah">
        <MenuItem>Item 1</MenuItem>
      </MenuButton>,
    );

    const menu = container.querySelector('.menu');
    expect(menu!.getAttribute('data-bs-placement')).toMatch(/-end$/);
  });

  it('passes variant and size to the toggle', () => {
    render(
      <MenuButton
        title="blah"
        size="sm"
        variant="success"
        data-testid="test-id"
      >
        <MenuItem>Item 1</MenuItem>
      </MenuButton>,
    );

    const button = screen.getByTestId('test-id').firstElementChild!;
    expect(button.classList).toContain('btn-solid');
    expect(button.classList).toContain('theme-success');
    expect(button.classList).toContain('btn-sm');
  });

  it('passes menuVariant to dropdown menu', () => {
    const { container } = render(
      <MenuButton defaultShow title="blah" menuVariant="dark">
        <MenuItem>Item 1</MenuItem>
      </MenuButton>,
    );

    const menu = container.querySelector('.menu');
    expect(menu!.getAttribute('data-bs-theme')).toEqual('dark');
  });

  it('forwards onSelect handler to MenuItems', () => {
    const onSelectSpy = vi.fn();

    render(
      <MenuButton defaultShow title="Simple Menu" onSelect={onSelectSpy}>
        <MenuItem eventKey="1" data-testid="key1">
          Item 1
        </MenuItem>
        <MenuItem eventKey="2" data-testid="key2">
          Item 2
        </MenuItem>
        <MenuItem eventKey="3" data-testid="key3">
          Item 3
        </MenuItem>
      </MenuButton>,
    );

    fireEvent.click(screen.getByTestId('key1'));
    expect(onSelectSpy).toHaveBeenCalledWith('1', expect.anything());
    fireEvent.click(screen.getByTestId('key2'));
    expect(onSelectSpy).toHaveBeenCalledWith('2', expect.anything());
    fireEvent.click(screen.getByTestId('key3'));
    expect(onSelectSpy).toHaveBeenCalledWith('3', expect.anything());

    expect(onSelectSpy).toBeCalledTimes(3);
  });

  it('does not close when onToggle is controlled', () => {
    const onSelectSpy = vi.fn();

    const { container } = render(
      <MenuButton
        show
        title="Simple Menu"
        onToggle={onSelectSpy}
        data-testid="test-id"
      >
        <MenuItem eventKey="1" data-testid="key1">
          Item 1
        </MenuItem>
      </MenuButton>,
    );

    fireEvent.click(screen.getByTestId('test-id').firstElementChild!);
    fireEvent.click(screen.getByTestId('key1'));

    expect(onSelectSpy).toHaveBeenCalledWith(false, expect.anything());
    const menu = container.querySelector('.menu[data-bs-placement]');
    expect(menu).toBeDefined();
  });

  it('Should pass disabled to button', () => {
    const { container } = render(
      <MenuButton disabled title="Title">
        <MenuItem eventKey="1">Item 1</MenuItem>
        <MenuItem eventKey="2">Item 2</MenuItem>
      </MenuButton>,
    );

    expect(container.querySelector('button[disabled]')).toBeDefined();
  });

  it('should pass bsPrefix to the button', () => {
    render(
      <MenuButton title="title" data-testid="test-id" bsPrefix="my-button">
        <MenuItem eventKey="1">Item 1</MenuItem>
      </MenuButton>,
    );

    const button = screen.getByTestId('test-id').firstElementChild!;
    expect(button.classList).toContain('my-button-solid');
  });
});
