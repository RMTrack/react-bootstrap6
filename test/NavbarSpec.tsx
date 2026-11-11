import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Nav from '../src/Nav';
import Navbar from '../src/Navbar';

describe('<Navbar>', () => {
  it('Should create nav element', () => {
    render(<Navbar data-testid="test" />);
    const navbarElem = screen.getByTestId('test');

    expect(navbarElem.classList).toContain('navbar');
    expect(navbarElem.classList).toContain('navbar-expand');
    expect(navbarElem.classList).not.toContain('navbar-light');
  });

  it('Should add "navigation" role when not using a `<nav>`', () => {
    render(<Navbar as="div" data-testid="test" />);
    const navbarElem = screen.getByTestId('test');

    expect(navbarElem.tagName).toEqual('DIV');
    expect(navbarElem.getAttribute('role')).toEqual('navigation');
  });

  it('Should add fixed=top|bottom variation', () => {
    render(<Navbar fixed="top" data-testid="test1" />);
    const firstNavbarElem = screen.getByTestId('test1');
    expect(firstNavbarElem.classList).toContain('fixed-top');

    render(<Navbar fixed="bottom" data-testid="test2" />);

    const navbarElem = screen.getByTestId('test2');
    expect(navbarElem.classList).toContain('fixed-bottom');
  });

  it('Should variant=dark', () => {
    render(<Navbar variant="dark" data-testid="test" />);
    const navbar = screen.getByTestId('test');
    // Bootstrap 6 dropped .navbar-dark; the navbar follows the color mode.
    expect(navbar.classList).not.toContain('navbar-dark');
    expect(navbar.getAttribute('data-bs-theme')).toEqual('dark');
  });

  it('Should override role attribute', () => {
    render(<Navbar role="banner" data-testid="test" />);
    expect(screen.getByTestId('test').getAttribute('role')).toEqual('banner');
  });

  it('Should pass navbar context to navs', () => {
    render(
      <Navbar>
        <Nav data-testid="test" />
      </Navbar>,
    );
    const navElem = screen.getByTestId('test');
    expect(navElem.classList).toContain('navbar-nav');
  });

  it('Should add custom toggle', () => {
    render(
      <Navbar>
        <Navbar.Toggle as="p" data-testid="test">
          hi
        </Navbar.Toggle>
      </Navbar>,
    );
    const navToggleElem = screen.getByTestId('test');
    expect(navToggleElem.textContent).toEqual('hi');
    expect(navToggleElem.classList).toContain('navbar-toggler');
    expect(navToggleElem.tagName).toEqual('P');
  });

  it('Should trigger onToggle', () => {
    const onToggleSpy = vi.fn();
    render(
      <Navbar onToggle={onToggleSpy}>
        <Navbar.Toggle data-testid="test" />
      </Navbar>,
    );
    const toggleElem = screen.getByTestId('test');
    fireEvent.click(toggleElem);

    expect(onToggleSpy).toHaveBeenCalledOnce();
    expect(onToggleSpy).toHaveBeenCalledWith(true);
  });

  it('Should not swallow onClick', () => {
    const onClickSpy = vi.fn();

    render(
      <Navbar>
        <Navbar.Toggle onClick={onClickSpy} data-testid="test" />
      </Navbar>,
    );
    const toggleElem = screen.getByTestId('test');
    fireEvent.click(toggleElem);

    expect(onClickSpy).toHaveBeenCalledOnce();
  });

  it('Should render the navigation drawer in place', () => {
    render(
      <Navbar data-testid="navbar">
        <Navbar.Drawer data-testid="test">hello</Navbar.Drawer>
      </Navbar>,
    );
    const drawer = screen.getByTestId('test');
    expect(drawer.tagName).toEqual('DIALOG');
    expect(drawer.classList).toContain('drawer');
    // Kept in the navbar so an expanded navbar can show it inline.
    expect(drawer.parentElement).toEqual(screen.getByTestId('navbar'));
  });

  it('Should pass expanded to the drawer', () => {
    render(
      <Navbar expanded>
        <Navbar.Drawer data-testid="test">hello</Navbar.Drawer>
      </Navbar>,
    );
    expect((screen.getByTestId('test') as HTMLDialogElement).open).toEqual(
      true,
    );
  });

  it('Should wire the toggle to the drawer', async () => {
    render(
      <Navbar>
        <Navbar.Toggle data-testid="toggler" />
        <Navbar.Drawer data-testid="drawer">hello</Navbar.Drawer>
      </Navbar>,
    );

    const toggleElem = screen.getByTestId('toggler');
    const drawerElem = screen.getByTestId('drawer') as HTMLDialogElement;

    expect(drawerElem.open).toEqual(false);
    expect(toggleElem.getAttribute('aria-expanded')).toEqual('false');

    fireEvent.click(toggleElem);

    await waitFor(() => expect(drawerElem.open).toEqual(true));
    expect(toggleElem.getAttribute('aria-expanded')).toEqual('true');
  });

  it('Should open external href link in collapseOnSelect', () => {
    const onClickSpy = vi.fn((e) => {
      // prevent actual redirect
      e.persist();
      e.preventDefault();
    });
    render(
      <Navbar>
        <Navbar.Toggle />
        <Navbar.Drawer>
          <Nav as="div">
            <Nav.Link
              href="https://www.google.com"
              data-testid="test"
              onClick={onClickSpy}
            />
          </Nav>
        </Navbar.Drawer>
      </Navbar>,
    );
    const linkItem = screen.getByTestId('test');
    fireEvent.click(linkItem);
    expect(onClickSpy).toHaveBeenCalledOnce();
    expect(screen.getByTestId('test').getAttribute('href')).toEqual(
      'https://www.google.com',
    );
  });

  it('Should fire external href click', async () => {
    const onClickSpy = vi.fn((e) => {
      // prevent actual redirect
      e.persist();
      e.preventDefault();
    });
    render(
      <Navbar expanded>
        <Navbar.Toggle />
        <Navbar.Drawer>
          <Nav as="div">
            <Nav.Link href="https://www.google.com" onClick={onClickSpy}>
              <span className="link-text" data-testid="test">
                Option 1
              </span>
            </Nav.Link>
          </Nav>
        </Navbar.Drawer>
      </Navbar>,
    );
    const innerLinkItem = screen.getByTestId('test');
    fireEvent.click(innerLinkItem);

    await waitFor(() => expect(onClickSpy).toHaveBeenCalledOnce());
  });

  it('Should collapseOnSelect & fire Nav subcomponent onSelect event if expanded', () => {
    const onToggleSpy = vi.fn();
    const onClickSpy = vi.fn();
    render(
      <Navbar collapseOnSelect onToggle={onToggleSpy} expanded>
        <Navbar.Toggle />
        <Navbar.Drawer>
          <Nav as="div">
            <Nav.Link href="#" onClick={onClickSpy}>
              <span className="link-text" data-testid="test">
                Option 1
              </span>
            </Nav.Link>
          </Nav>
        </Navbar.Drawer>
      </Navbar>,
    );
    const innerLinkElem = screen.getByTestId('test');
    fireEvent.click(innerLinkElem);

    expect(onClickSpy).toHaveBeenCalledOnce();
    expect(onToggleSpy).toHaveBeenCalledOnce();
    expect(onToggleSpy).toHaveBeenCalledWith(false);
  });

  it('Should fire onSelect with eventKey for nav children', () => {
    const onSelectSpy = vi.fn();
    const onClickSpy = vi.fn();

    render(
      <Navbar onSelect={onSelectSpy}>
        <Navbar.Toggle />
        <Navbar.Drawer>
          <Nav as="div">
            <Nav.Link href="#home" onClick={onClickSpy}>
              <span className="link-text" data-testid="test">
                Option 1
              </span>
            </Nav.Link>
          </Nav>
        </Navbar.Drawer>
      </Navbar>,
    );
    const innerLinkElem = screen.getByTestId('test');
    fireEvent.click(innerLinkElem);

    expect(onClickSpy).toHaveBeenCalledOnce();
    expect(onSelectSpy).toHaveBeenCalledOnce();
    expect(onSelectSpy).toHaveBeenCalledWith('#home', expect.anything());
  });

  it('Should have nav as default component', () => {
    render(<Navbar data-testid="test" />);
    expect(screen.getByTestId('test').tagName).toEqual('NAV');
  });

  it('Should render correctly when expand is a string', () => {
    render(<Navbar expand="sm" data-testid="test" />);
    expect(screen.getByTestId('test').classList).toContain('sm:navbar-expand');
  });

  it('should allow custom breakpoints for expand', () => {
    render(<Navbar expand="custom" data-testid="test" />);
    expect(screen.getByTestId('test').classList).toContain(
      'custom:navbar-expand',
    );
  });

  it('Should render correctly when bg is set', () => {
    render(<Navbar bg="light" data-testid="test" />);
    expect(screen.getByTestId('test').classList).toContain('bg-light');
  });

  it('Should render correctly when sticky is set', () => {
    render(<Navbar sticky="top" data-testid="test" />);
    expect(screen.getByTestId('test').classList).toContain('sticky-top');
  });
});
