import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavbarToggle from '../src/NavbarToggle';

describe('<NavbarToggle>', () => {
  it('Should have button as default component', () => {
    render(<NavbarToggle data-testid="test" />);
    expect(screen.getByTestId('test').tagName).toEqual('BUTTON');
  });
  it('Should render Bootstrap 6 toggler markup', () => {
    render(<NavbarToggle data-testid="test" />);

    const toggle = screen.getByTestId('test');
    expect(toggle.classList).toContain('btn-icon');
    expect(toggle.classList).toContain('navbar-toggler');
    expect(toggle.classList).not.toContain('collapsed');
    expect(toggle.getAttribute('aria-expanded')).toEqual('false');

    const icon = toggle.querySelector('.navbar-toggler-icon')!;
    expect(icon.getAttribute('aria-hidden')).toEqual('true');
  });
});
