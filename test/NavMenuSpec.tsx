import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MenuItem from '../src/MenuItem';
import Nav from '../src/Nav';
import Navbar from '../src/Navbar';
import NavMenu from '../src/NavMenu';

describe('<NavMenu>', () => {
  it('Should render li when in nav', () => {
    render(
      <NavMenu
        defaultShow
        title="Title"
        className="test-class"
        id="nav-test"
        data-testid="test"
      >
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2">MenuItem 2 content</MenuItem>
      </NavMenu>,
    );
    const navDropdownElem = screen.getByTestId('test');
    expect(navDropdownElem.classList).toContain('nav-item');
    expect(navDropdownElem.classList).toContain('test-class');

    expect(navDropdownElem.firstElementChild!.classList).toContain('nav-link');
    expect(navDropdownElem.firstElementChild!.textContent).toEqual('Title');
  });

  it('renders active toggle', () => {
    render(
      <NavMenu
        defaultShow
        active
        title="Title"
        id="nav-test"
        data-testid="test"
      >
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2">MenuItem 2 content</MenuItem>
      </NavMenu>,
    );
    const navDropdownElem = screen.getByTestId('test');
    expect(navDropdownElem.firstElementChild!.classList).toContain('active');
  });

  it('should handle child active state', () => {
    render(
      <Nav defaultActiveKey="2">
        <NavMenu defaultShow id="test-id" title="title">
          <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
          <MenuItem eventKey="2" data-testid="test">
            MenuItem 2 content
          </MenuItem>
          <MenuItem eventKey="3">MenuItem 3 content</MenuItem>
        </NavMenu>
      </Nav>,
    );

    expect(screen.getByTestId('test').textContent).toEqual(
      'MenuItem 2 content',
    );
  });

  it('should pass the id to the NavLink element', () => {
    render(
      <NavMenu id="test-id" title="title" data-testid="test">
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
      </NavMenu>,
    );
    expect(screen.getByTestId('test').firstElementChild!.id).toEqual('test-id');
  });

  it('should support as as prop', () => {
    render(
      <NavMenu as="li" id="test-id" title="title" data-testid="test">
        <MenuItem eventKey="1">Item 1</MenuItem>
      </NavMenu>,
    );
    expect(screen.getByTestId('test').tagName).toEqual('LI');
  });

  it('passes menuVariant to dropdown menu', () => {
    render(
      <NavMenu renderMenuOnMount title="blah" menuVariant="dark" id="test">
        <MenuItem>Item 1</MenuItem>
      </NavMenu>,
    );
    expect(document.querySelector('.menu-dark')).toBeDefined();
  });

  // Bootstrap 6 has no navbar-specific menu CSS, so the menu is positioned
  // against its toggle like any other menu.
  it('positions menus in a navbar', async () => {
    render(
      <Navbar>
        <NavMenu defaultShow id="test-id" title="title">
          <MenuItem>Item 1</MenuItem>
        </NavMenu>
      </Navbar>,
    );
    const menu = document.querySelector<HTMLElement>('.menu')!;
    expect(menu).toBeTruthy();
    await waitFor(() => expect(menu.style.position).toEqual('absolute'));
    expect(menu.getAttribute('data-bs-placement')).toMatch(/^bottom/);
  });
});
