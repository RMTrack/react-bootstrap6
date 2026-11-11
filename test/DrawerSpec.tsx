import * as React from 'react';
import { useEffect } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Drawer from '../src/Drawer';

const noop = () => {};

// A click on the native ::backdrop targets the <dialog> outside its box.
function clickBackdrop(dialog: HTMLElement) {
  fireEvent.click(dialog, { clientX: -10, clientY: -10 });
}

describe('<Drawer>', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dialog-open');
  });

  it('Should render the drawer content', () => {
    render(
      <Drawer show onHide={noop}>
        <strong data-testid="test">Message</strong>
      </Drawer>,
    );
    const strongElem = screen.getByTestId('test');
    expect(strongElem.tagName).toEqual('STRONG');
    expect(strongElem.textContent).toEqual('Message');
  });

  it('Should render a native dialog.drawer opened as a modal', () => {
    render(
      <Drawer data-testid="test" show>
        <strong>Message</strong>
      </Drawer>,
    );
    const drawer = screen.getByTestId('test') as HTMLDialogElement;

    expect(drawer.tagName).toEqual('DIALOG');
    expect(drawer.classList).toContain('drawer');
    expect(drawer.classList).toContain('drawer-start');
    expect(drawer.classList).not.toContain('offcanvas');
    expect(drawer.open).toEqual(true);
    expect(drawer.matches(':modal')).toEqual(true);
    expect(document.querySelector('.offcanvas-backdrop')).toBeNull();
  });

  it('Should forward ref to the native dialog element', () => {
    const ref = React.createRef<HTMLDialogElement>();
    render(
      <Drawer ref={ref} show>
        <strong>Message</strong>
      </Drawer>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDialogElement);
  });

  it('Should render in place rather than in a portal', () => {
    render(
      <div data-testid="parent">
        <Drawer data-testid="test" show>
          <strong>Message</strong>
        </Drawer>
      </div>,
    );

    expect(screen.getByTestId('test').parentElement).toEqual(
      screen.getByTestId('parent'),
    );
  });

  it('Should set the placement class', () => {
    render(
      <Drawer data-testid="test" show placement="end">
        <strong>Message</strong>
      </Drawer>,
    );

    expect(screen.getByTestId('test').classList).toContain('drawer-end');
  });

  it('Should add drawer-instant when animation is false', () => {
    render(
      <Drawer data-testid="test" show animation={false}>
        <strong>Message</strong>
      </Drawer>,
    );

    expect(screen.getByTestId('test').classList).toContain('drawer-instant');
  });

  it('Should close the drawer when the close button is clicked', async () => {
    const onHideSpy = vi.fn();

    render(
      <Drawer show onHide={onHideSpy}>
        <Drawer.Header closeButton />
        <strong>Message</strong>
      </Drawer>,
    );
    const buttonElem = document.getElementsByClassName('btn-close')[0];

    fireEvent.click(buttonElem);

    await waitFor(() => expect(onHideSpy).toHaveBeenCalled());
  });

  it('Should pass className to the drawer', () => {
    render(
      <Drawer show className="myoffcanvas" onHide={noop} data-testid="test">
        <strong>Message</strong>
      </Drawer>,
    );
    const offcanvasElem = screen.getByTestId('test');
    expect(offcanvasElem.classList).toContain('myoffcanvas');
  });

  it('Should pass style to the drawer', () => {
    render(
      <Drawer show style={{ color: 'red' }} onHide={noop} data-testid="test">
        <strong>Message</strong>
      </Drawer>,
    );
    const offcanvasElem = screen.getByTestId('test');
    expect(offcanvasElem.style.color).toEqual('red');
  });

  it('Should pass transition callbacks to Transition', async () => {
    const increment = vi.fn();
    const Elem = () => {
      const [show, setShow] = React.useState(true);
      return (
        <Drawer
          show={show}
          onHide={noop}
          onExit={increment}
          onExiting={increment}
          onExited={increment}
          onEnter={increment}
          onEntering={increment}
          onEntered={() => {
            increment();
            setShow(false);
          }}
        >
          <strong>Message</strong>
        </Drawer>
      );
    };

    render(<Elem />);

    await waitFor(() => expect(increment).toHaveBeenCalledTimes(6));
  });

  it('Should close the dialog at once and add .hiding when hidden', async () => {
    const { rerender } = render(
      <Drawer data-testid="test" show>
        <strong>Message</strong>
      </Drawer>,
    );
    const drawer = screen.getByTestId('test') as HTMLDialogElement;

    rerender(
      <Drawer data-testid="test" show={false}>
        <strong>Message</strong>
      </Drawer>,
    );

    // Unlike Dialog, Drawer closes the dialog when the exit starts.
    expect(drawer.open).toEqual(false);
    expect(drawer.classList).toContain('hiding');
    await waitFor(() => expect(drawer.classList).not.toContain('hiding'));
    // ...and stays mounted.
    expect(drawer.isConnected).toEqual(true);
  });

  it('Should close when backdrop clicked', () => {
    const onHideSpy = vi.fn();
    render(
      <Drawer show onHide={onHideSpy} data-testid="test">
        <strong>Message</strong>
      </Drawer>,
    );

    clickBackdrop(screen.getByTestId('test'));

    expect(onHideSpy).toHaveBeenCalled();
  });

  it('should not close when static backdrop is clicked', () => {
    const onHideSpy = vi.fn();
    render(
      <Drawer show onHide={onHideSpy} backdrop="static" data-testid="test">
        <strong>Message</strong>
      </Drawer>,
    );
    const drawer = screen.getByTestId('test');

    clickBackdrop(drawer);

    expect(onHideSpy).not.toHaveBeenCalled();
    expect(drawer.classList).toContain('drawer-static');
  });

  it('Should not call onHide if the click target comes from inside the drawer', () => {
    const onHideSpy = vi.fn();
    render(
      <Drawer show onHide={onHideSpy} data-testid="test">
        <strong>Message</strong>
      </Drawer>,
    );
    fireEvent.click(screen.getByText('Message'));

    expect(onHideSpy).not.toHaveBeenCalled();
  });

  it('Should set aria-labelledby to the dialog element if aria-labelledby set', () => {
    render(
      <Drawer
        show
        onHide={noop}
        aria-labelledby="offcanvas-title"
        data-testid="test"
      >
        <Drawer.Header closeButton>
          <Drawer.Title id="offcanvas-title">Drawer heading</Drawer.Title>
        </Drawer.Header>
      </Drawer>,
    );
    const offcanvasElem = screen.getByTestId('test');
    expect(offcanvasElem.getAttribute('aria-labelledby')).toEqual(
      'offcanvas-title',
    );
    expect(screen.getByRole('dialog', { name: 'Drawer heading' })).toEqual(
      offcanvasElem,
    );
  });

  it('Should render the drawer header, title and body classes', () => {
    render(
      <Drawer show>
        <Drawer.Header data-testid="header">
          <Drawer.Title data-testid="title">Title</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body data-testid="body">Body</Drawer.Body>
      </Drawer>,
    );

    expect(screen.getByTestId('header').classList).toContain('drawer-header');
    expect(screen.getByTestId('title').classList).toContain('drawer-title');
    expect(screen.getByTestId('title').tagName).toEqual('H5');
    expect(screen.getByTestId('body').classList).toContain('drawer-body');
  });

  it('Should call onEscapeKeyDown when keyboard is true', () => {
    const onEscapeKeyDownSpy = vi.fn();
    render(
      <Drawer show onHide={noop} keyboard onEscapeKeyDown={onEscapeKeyDownSpy}>
        <strong>Message</strong>
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape', keyCode: 27 });
    expect(onEscapeKeyDownSpy).toHaveBeenCalled();
  });

  it('Should not call onEscapeKeyDown when keyboard is false', () => {
    const onEscapeKeyDownSpy = vi.fn();
    render(
      <Drawer
        show
        onHide={noop}
        keyboard={false}
        onEscapeKeyDown={onEscapeKeyDownSpy}
      >
        <strong>Message</strong>
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape', keyCode: 27 });
    expect(onEscapeKeyDownSpy).not.toHaveBeenCalled();
  });

  it('Should lock page scroll with dialog-open on the html element', () => {
    render(
      <Drawer show onHide={noop}>
        <strong>Message</strong>
      </Drawer>,
    );

    expect(document.documentElement.classList).toContain('dialog-open');
  });

  it('should not lock page scroll when scroll=true', () => {
    render(
      <Drawer show onHide={noop} scroll data-testid="test">
        <strong>Message</strong>
      </Drawer>,
    );

    expect(document.documentElement.classList).not.toContain('dialog-open');
    // With a backdrop it is still modal.
    expect(screen.getByTestId('test').matches(':modal')).toEqual(true);
  });

  it('should open as a non-modal dialog when scroll=true and backdrop=false', () => {
    render(
      <Drawer show onHide={noop} scroll backdrop={false} data-testid="test">
        <strong>Message</strong>
      </Drawer>,
    );
    const drawer = screen.getByTestId('test') as HTMLDialogElement;

    expect(drawer.open).toEqual(true);
    expect(drawer.matches(':modal')).toEqual(false);
  });

  it('should set responsive class', () => {
    render(
      <Drawer data-testid="test" responsive="lg" show onHide={noop}>
        <strong>Message</strong>
      </Drawer>,
    );
    const offcanvasElem = screen.getByTestId('test');
    expect(offcanvasElem.classList).toContain('lg:drawer');
    expect(offcanvasElem.classList).not.toContain('drawer');
  });

  it('should render the closed drawer when show=false', () => {
    render(
      <Drawer data-testid="test" responsive="lg" onHide={noop}>
        <strong>Message</strong>
      </Drawer>,
    );
    const drawer = screen.getByTestId('test') as HTMLDialogElement;
    expect(drawer.open).toEqual(false);
    expect(screen.getByText('Message')).toBeDefined();
  });

  it('should not mount, unmount and mount content on show', () => {
    const InnerComponent = ({ onMount, onUnmount }) => {
      useEffect(() => {
        onMount();
        return () => {
          onUnmount();
        };
      }, []);

      return <div>Content</div>;
    };

    const onMountSpy = vi.fn();
    const onUnmountSpy = vi.fn();

    const { rerender, unmount } = render(
      <Drawer data-testid="test" onHide={noop}>
        <InnerComponent onMount={onMountSpy} onUnmount={onUnmountSpy} />
      </Drawer>,
    );

    rerender(
      <Drawer data-testid="test" onHide={noop} show>
        <InnerComponent onMount={onMountSpy} onUnmount={onUnmountSpy} />
      </Drawer>,
    );

    expect(onMountSpy).toHaveBeenCalledOnce();

    unmount();

    expect(onUnmountSpy).toHaveBeenCalledOnce();
  });
});
