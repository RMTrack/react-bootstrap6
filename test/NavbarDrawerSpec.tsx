import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Navbar from '../src/Navbar';
import Drawer from '../src/Drawer';

describe('<NavbarDrawer>', () => {
  it('should open the offcanvas', () => {
    render(
      <Navbar>
        <Navbar.Toggle data-testid="toggle" />
        <Navbar.Drawer data-testid="offcanvas">hello</Navbar.Drawer>
      </Navbar>,
    );

    fireEvent.click(screen.getByTestId('toggle'));
    const drawer = screen.getByTestId('offcanvas') as HTMLDialogElement;
    expect(drawer.tagName).toEqual('DIALOG');
    expect(drawer.open).toEqual(true);
  });

  it('should close the offcanvas on header close button click', () => {
    const onToggleSpy = vi.fn();
    render(
      <Navbar onToggle={onToggleSpy} expanded>
        <Navbar.Toggle data-testid="toggle" />
        <Navbar.Drawer data-testid="offcanvas">
          <Drawer.Header closeButton>header</Drawer.Header>
        </Navbar.Drawer>
      </Navbar>,
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onToggleSpy).toHaveBeenCalledWith(false);
  });

  it('should render nav items with expand prop', () => {
    render(
      <Navbar expand="sm">
        <Navbar.Toggle data-testid="toggle" />
        <Navbar.Drawer data-testid="offcanvas">hello</Navbar.Drawer>
      </Navbar>,
    );

    expect(screen.getByText('hello')).toBeDefined();
  });
});
