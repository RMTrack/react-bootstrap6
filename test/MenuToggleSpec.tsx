import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import MenuToggle from '../src/MenuToggle';

describe('<MenuToggle>', () => {
  it('renders toggle button', () => {
    render(<MenuToggle id="test-id">herpa derpa</MenuToggle>);

    const toggle = screen.getByText('herpa derpa');
    expect(toggle.getAttribute('aria-expanded')).toEqual('false');
    expect(toggle.classList).not.toContain('dropdown-toggle');
    expect(toggle.classList).toContain('btn-solid');
    expect(toggle.classList).toContain('theme-primary');
  });

  it('renders children', () => {
    render(
      <MenuToggle id="test-id">
        <h3>herpa derpa</h3>
      </MenuToggle>,
    );

    expect(screen.getByText('herpa derpa')).toBeDefined();
  });

  it('forwards onClick handler', () => {
    const onClickSpy = vi.fn();

    const { container } = render(
      <MenuToggle id="test-id" title="click forwards" onClick={onClickSpy} />,
    );

    fireEvent.click(container.firstElementChild!);
    expect(onClickSpy).toHaveBeenCalled();
  });

  it('forwards id', () => {
    const { container } = render(<MenuToggle id="testid" />);
    expect(container.firstElementChild!.id).toEqual('testid');
  });

  it('does not forward bsPrefix', () => {
    const { container } = render(
      <MenuToggle bsPrefix="my-custom-bsPrefix" title="bsClass" id="test-id" />,
    );
    // Non-split toggles render no toggle class; bsPrefix is not forwarded
    // to the button.
    expect(container.firstElementChild!.classList).not.toContain(
      'my-custom-bsPrefix',
    );
    expect(container.firstElementChild!.classList).toContain('btn-solid');
  });
});
