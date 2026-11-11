import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Dialog from '../src/Dialog';

function getDialog() {
  return screen.getByRole('dialog') as HTMLDialogElement;
}

// A click on the native ::backdrop targets the <dialog> outside its box.
function clickBackdrop(dialog: HTMLDialogElement) {
  fireEvent.click(dialog, { clientX: 0, clientY: 0 });
}

function pressEscape(target: Element = getDialog()) {
  fireEvent.keyDown(target, { key: 'Escape', keyCode: 27 });
}

describe('<Dialog>', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dialog-open');
  });

  it('Should forward ref to the native dialog element', () => {
    const ref = React.createRef<HTMLDialogElement>();
    render(
      <Dialog show animation={false} ref={ref}>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDialogElement);
    expect(ref.current).toEqual(getDialog());
  });

  it('Should render the modal content', () => {
    render(
      <Dialog show animation={false} data-testid="modal">
        <strong>Message</strong>
      </Dialog>,
    );

    expect(
      screen.getByTestId('modal').querySelector('strong')!.textContent,
    ).toEqual('Message');
  });

  it('Should render a native dialog opened as a modal', () => {
    render(
      <Dialog show>
        <strong>Message</strong>
      </Dialog>,
    );

    const dialog = getDialog();
    expect(dialog.tagName).toEqual('DIALOG');
    expect(dialog.classList).toContain('dialog');
    expect(dialog.open).toEqual(true);
    expect(dialog.matches(':modal')).toEqual(true);
  });

  it('Should render children directly inside the dialog', () => {
    render(
      <Dialog show>
        <Dialog.Header data-testid="header" />
      </Dialog>,
    );

    expect(screen.getByTestId('header').parentElement).toEqual(getDialog());
    expect(document.querySelector('.modal-dialog')).toBeNull();
    expect(document.querySelector('.modal-content')).toBeNull();
    expect(document.querySelector('.modal-backdrop')).toBeNull();
  });

  it('Should portal the dialog into the body by default', () => {
    render(
      <Dialog show>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(getDialog().parentElement).toEqual(document.body);
  });

  it('Should render into the container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <Dialog show container={container}>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(getDialog().parentElement).toEqual(container);
    container.remove();
  });

  it('Should not render when not shown', () => {
    render(
      <Dialog show={false}>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(document.querySelector('dialog')).toBeNull();
  });

  it('Should add the dialog-instant class when animation is false', () => {
    render(
      <Dialog show animation={false}>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(getDialog().classList).toContain('dialog-instant');
  });

  it('Should not add the dialog-instant class when animated', () => {
    render(
      <Dialog show>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(getDialog().classList).not.toContain('dialog-instant');
  });

  it('Should lock page scroll with dialog-open on the html element', async () => {
    const { rerender } = render(
      <Dialog show>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(document.documentElement.classList).toContain('dialog-open');
    expect(document.body.classList).not.toContain('modal-open');

    rerender(
      <Dialog show={false}>
        <strong>Message</strong>
      </Dialog>,
    );

    await waitFor(() =>
      expect(document.documentElement.classList).not.toContain('dialog-open'),
    );
  });

  it('Should keep dialog-open while another modal is open', async () => {
    const { rerender } = render(
      <>
        <Dialog show>One</Dialog>
        <Dialog show>Two</Dialog>
      </>,
    );

    rerender(
      <>
        <Dialog show={false}>One</Dialog>
        <Dialog show>Two</Dialog>
      </>,
    );

    await waitFor(() => expect(screen.getAllByRole('dialog')).toHaveLength(1));
    expect(document.documentElement.classList).toContain('dialog-open');
  });

  it('Should add hiding while closing, then close and unmount', async () => {
    const onExitingSpy = vi.fn();
    const { rerender } = render(
      <Dialog show onExiting={onExitingSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    const dialog = getDialog();
    await waitFor(() => expect(dialog.open).toEqual(true));

    rerender(
      <Dialog show={false} onExiting={onExitingSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(onExitingSpy).toHaveBeenCalledOnce();
    expect(dialog.classList).toContain('hiding');
    // Kept in the top layer during the exit transition.
    expect(dialog.open).toEqual(true);

    await waitFor(() => expect(dialog.isConnected).toEqual(false));
    expect(dialog.open).toEqual(false);
  });

  it('Should close the modal when the backdrop is clicked', () => {
    const onHideSpy = vi.fn();

    render(
      <Dialog show onHide={onHideSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    clickBackdrop(getDialog());

    expect(onHideSpy).toHaveBeenCalledOnce();
  });

  it('Should not close the modal when the dialog content is clicked', () => {
    const onHideSpy = vi.fn();

    render(
      <Dialog show onHide={onHideSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    fireEvent.click(screen.getByText('Message'));

    expect(onHideSpy).not.toHaveBeenCalled();
  });

  it('Should not close the modal on backdrop click when backdrop is false', () => {
    const onHideSpy = vi.fn();

    render(
      <Dialog show backdrop={false} onHide={onHideSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    clickBackdrop(getDialog());

    expect(onHideSpy).not.toHaveBeenCalled();
    expect(getDialog().classList).not.toContain('dialog-static');
  });

  it('Should not close the modal when the "static" backdrop is clicked', () => {
    const onHideSpy = vi.fn();
    render(
      <Dialog show onHide={onHideSpy} backdrop="static">
        <strong>Message</strong>
      </Dialog>,
    );

    clickBackdrop(getDialog());
    expect(onHideSpy).not.toHaveBeenCalled();
  });

  it('Should show "static" dialog animation when backdrop is clicked', async () => {
    render(
      <Dialog show backdrop="static">
        <strong>Message</strong>
      </Dialog>,
    );

    clickBackdrop(getDialog());
    expect(getDialog().classList).toContain('dialog-static');

    await waitFor(() =>
      expect(getDialog().classList).not.toContain('dialog-static'),
    );
  });

  it('Should show "static" dialog animation when esc pressed and keyboard is false', () => {
    const onHideSpy = vi.fn();
    render(
      <Dialog show backdrop="static" keyboard={false} onHide={onHideSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    pressEscape();

    expect(getDialog().classList).toContain('dialog-static');
    expect(onHideSpy).not.toHaveBeenCalled();
  });

  it('Should not show "static" dialog animation when esc pressed and keyboard is true', () => {
    const onHideSpy = vi.fn();
    render(
      <Dialog show backdrop="static" keyboard onHide={onHideSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    pressEscape();

    expect(getDialog().classList).not.toContain('dialog-static');
    expect(onHideSpy).toHaveBeenCalledOnce();
  });

  it('Should not show "static" dialog animation when backdrop is not "static"', () => {
    render(
      <Dialog show backdrop>
        <strong>Message</strong>
      </Dialog>,
    );

    clickBackdrop(getDialog());
    expect(getDialog().classList).not.toContain('dialog-static');
  });

  it('Should cancel the native close request when esc is pressed', () => {
    render(
      <Dialog show>
        <strong>Message</strong>
      </Dialog>,
    );

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    getDialog().dispatchEvent(event);

    expect(event.defaultPrevented).toEqual(true);
    // `show` is still true, so the dialog stays open until the parent updates.
    expect(getDialog().open).toEqual(true);
  });

  it('Should close the modal when the modal close button is clicked', () => {
    const onHideSpy = vi.fn();

    render(
      <Dialog show onHide={onHideSpy}>
        <Dialog.Header closeButton data-testid="close-btn" />
        <strong>Message</strong>
      </Dialog>,
    );

    fireEvent.click(screen.getByTestId('close-btn').querySelector('button')!);

    expect(onHideSpy).toHaveBeenCalledOnce();
  });

  it('Should pass className to the dialog', () => {
    render(
      <Dialog show className="mymodal">
        <strong>Message</strong>
      </Dialog>,
    );

    expect(getDialog().classList).toContain('mymodal');
    expect(getDialog().classList).toContain('dialog');
  });

  it('Should allow a custom bsPrefix', () => {
    render(
      <Dialog show bsPrefix="my-dialog" size="lg" animation={false}>
        <strong>Message</strong>
      </Dialog>,
    );

    const { classList } = getDialog();
    expect(classList).toContain('my-dialog');
    expect(classList).toContain('my-dialog-lg');
    expect(classList).toContain('my-dialog-instant');
  });

  it('Should pass size to the dialog', () => {
    render(
      <Dialog show size="sm" data-testid="modal">
        <strong>Message</strong>
      </Dialog>,
    );

    expect(screen.getByTestId('modal').classList).toContain('dialog-sm');
  });

  it('Should pass fullscreen as bool to the dialog', () => {
    render(
      <Dialog show fullscreen data-testid="modal">
        <strong>Message</strong>
      </Dialog>,
    );

    expect(screen.getByTestId('modal').classList).toContain(
      'dialog-fullscreen',
    );
  });

  it('Should pass fullscreen as string to the dialog', () => {
    render(
      <Dialog show fullscreen="sm-down" data-testid="modal">
        <strong>Message</strong>
      </Dialog>,
    );

    expect(screen.getByTestId('modal').classList).toContain(
      'sm-down:dialog-fullscreen',
    );
  });

  it('Should allow custom breakpoints for fullscreen', () => {
    render(
      <Dialog show fullscreen="custom-down" data-testid="modal">
        <strong>Message</strong>
      </Dialog>,
    );

    expect(screen.getByTestId('modal').classList).toContain(
      'custom-down:dialog-fullscreen',
    );
  });

  it('Should pass scrollable to the dialog', () => {
    render(
      <Dialog show scrollable data-testid="modal">
        <strong>Message</strong>
      </Dialog>,
    );

    expect(screen.getByTestId('modal').classList).toContain(
      'dialog-scrollable',
    );
  });

  it('Should pass dialog style to the dialog', () => {
    render(
      <Dialog show style={{ color: 'red' }}>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(getDialog().style.color).toEqual('red');
  });

  it('Should pass data-bs-theme to the dialog', () => {
    render(
      <Dialog show data-bs-theme="dark">
        <strong>Message</strong>
      </Dialog>,
    );

    expect(getDialog().getAttribute('data-bs-theme')).toEqual('dark');
  });

  it('Should open as a non-modal dialog when modal is false', () => {
    const onHideSpy = vi.fn();
    render(
      <Dialog show modal={false} onHide={onHideSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    const dialog = getDialog();
    expect(dialog.open).toEqual(true);
    expect(dialog.matches(':modal')).toEqual(false);
    expect(dialog.classList).toContain('dialog-nonmodal');
    expect(document.documentElement.classList).not.toContain('dialog-open');

    clickBackdrop(dialog);
    expect(onHideSpy).not.toHaveBeenCalled();

    pressEscape(screen.getByText('Message'));
    expect(onHideSpy).toHaveBeenCalledOnce();
  });

  it('Should pass transition callbacks to Transition', async () => {
    const increment = vi.fn();
    const Elem = () => {
      const [show, setShow] = React.useState(true);
      return (
        <Dialog
          show={show}
          onEnter={increment}
          onEntering={increment}
          onEntered={() => {
            increment();
            setShow(false);
          }}
          onExit={increment}
          onExiting={increment}
          onExited={increment}
        >
          <strong>Message</strong>
        </Dialog>
      );
    };

    render(<Elem />);

    await waitFor(() => expect(increment).toHaveBeenCalledTimes(6));
  });

  it('Should pass the dialog element to transition callbacks', async () => {
    const onEnter = vi.fn();
    const onEntered = vi.fn();

    render(
      <Dialog show onEnter={onEnter} onEntered={onEntered}>
        <strong>Message</strong>
      </Dialog>,
    );

    await waitFor(() => expect(onEntered).toHaveBeenCalled());
    expect(onEnter).toHaveBeenCalledWith(getDialog(), true);
    expect(onEntered).toHaveBeenCalledWith(getDialog(), true);
  });

  it('Should call onShow when opening', () => {
    const onShowSpy = vi.fn();
    render(
      <Dialog show onShow={onShowSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(onShowSpy).toHaveBeenCalledOnce();
  });

  it('Should reopen if shown again while closing', async () => {
    const onExitedSpy = vi.fn();
    const { rerender } = render(
      <Dialog show onExited={onExitedSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    const dialog = getDialog();
    rerender(
      <Dialog show={false} onExited={onExitedSpy}>
        <strong>Message</strong>
      </Dialog>,
    );
    expect(dialog.classList).toContain('hiding');

    rerender(
      <Dialog show onExited={onExitedSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    expect(dialog.classList).not.toContain('hiding');
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(onExitedSpy).not.toHaveBeenCalled();
    expect(dialog.open).toEqual(true);
    expect(dialog.isConnected).toEqual(true);
  });

  it('Should close the dialog if unmounted while open', () => {
    const { unmount } = render(
      <Dialog show>
        <strong>Message</strong>
      </Dialog>,
    );

    const dialog = getDialog();
    unmount();

    expect(dialog.open).toEqual(false);
    expect(document.documentElement.classList).not.toContain('dialog-open');
  });

  it('Should focus children with autoFocus', async () => {
    render(
      <Dialog show>
        <button type="button">First</button>
        <input data-testid="input" autoFocus />
      </Dialog>,
    );

    await waitFor(() =>
      expect(document.activeElement).toEqual(screen.getByTestId('input')),
    );
  });

  it('Should not call onHide if the click target comes from inside the dialog', () => {
    const onHideSpy = vi.fn();
    render(
      <Dialog show onHide={onHideSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    const dialog = getDialog();
    fireEvent.mouseDown(screen.getByText('Message'));
    fireEvent.mouseUp(dialog, { clientX: 0, clientY: 0 });
    clickBackdrop(dialog);

    expect(onHideSpy).not.toHaveBeenCalled();
  });

  it('Should set aria-labelledby to the dialog element if aria-labelledby set', () => {
    render(
      <Dialog show aria-labelledby="modal-title">
        <Dialog.Header closeButton>
          <Dialog.Title id="modal-title">Dialog heading</Dialog.Title>
        </Dialog.Header>
      </Dialog>,
    );

    expect(getDialog().getAttribute('aria-labelledby')).toEqual('modal-title');
    expect(screen.getByRole('dialog', { name: 'Dialog heading' })).toEqual(
      getDialog(),
    );
  });

  it('Should set aria-describedby to the dialog element if aria-describedby set', () => {
    render(
      <Dialog show aria-describedby="modal-title">
        <Dialog.Header closeButton>
          <Dialog.Title id="modal-title">Dialog heading</Dialog.Title>
        </Dialog.Header>
      </Dialog>,
    );

    expect(getDialog().getAttribute('aria-describedby')).toEqual('modal-title');
  });

  it('Should set aria-label to the dialog element if aria-label set', () => {
    const labelValue = 'modal-label';
    render(
      <Dialog show aria-label={labelValue}>
        <Dialog.Header closeButton>
          <Dialog.Title id="modal-title">Dialog heading</Dialog.Title>
        </Dialog.Header>
      </Dialog>,
    );

    expect(getDialog().getAttribute('aria-label')).toEqual(labelValue);
  });

  it('Should call onEscapeKeyDown when keyboard is true', () => {
    const onEscapeKeyDownSpy = vi.fn();
    render(
      <Dialog show keyboard onEscapeKeyDown={onEscapeKeyDownSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    pressEscape();

    expect(onEscapeKeyDownSpy).toHaveBeenCalledOnce();
  });

  it('Should not call onHide when onEscapeKeyDown prevents default', () => {
    const onHideSpy = vi.fn();
    render(
      <Dialog
        show
        onHide={onHideSpy}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <strong>Message</strong>
      </Dialog>,
    );

    pressEscape();

    expect(onHideSpy).not.toHaveBeenCalled();
  });

  it('Should not call onEscapeKeyDown when keyboard is false', () => {
    const onEscapeKeyDownSpy = vi.fn();
    render(
      <Dialog show keyboard={false} onEscapeKeyDown={onEscapeKeyDownSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    pressEscape();

    expect(onEscapeKeyDownSpy).not.toHaveBeenCalled();
  });

  it('Should not hide modal when keyboard is false', async () => {
    function DialogTest() {
      const [show, setShow] = React.useState(false);

      return (
        <>
          <Dialog show={show} onHide={() => setShow(false)} keyboard={false}>
            <strong>Message</strong>
          </Dialog>
          <button type="button" onClick={() => setShow((s) => !s)}>
            Button
          </button>
        </>
      );
    }

    render(<DialogTest />);

    // Show the modal.
    fireEvent.click(screen.getByRole('button'));

    const dialog = await screen.findByRole('dialog');
    pressEscape(dialog);

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.getByRole('dialog')).toEqual(dialog);
    expect((dialog as HTMLDialogElement).open).toEqual(true);
  });

  it('Should only close the topmost modal on escape', () => {
    const onHideOuter = vi.fn();
    const onHideInner = vi.fn();
    render(
      <Dialog show onHide={onHideOuter} data-testid="outer">
        <Dialog show onHide={onHideInner} data-testid="inner">
          <strong>Inner</strong>
        </Dialog>
      </Dialog>,
    );

    pressEscape(screen.getByTestId('inner'));

    expect(onHideInner).toHaveBeenCalledOnce();
    expect(onHideOuter).not.toHaveBeenCalled();
  });

  it('Should call onHide when the dialog is closed natively', async () => {
    const onHideSpy = vi.fn();
    render(
      <Dialog show onHide={onHideSpy}>
        <form method="dialog">
          <button type="submit">Submit</button>
        </form>
      </Dialog>,
    );

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(onHideSpy).toHaveBeenCalledOnce());
    expect(document.documentElement.classList).not.toContain('dialog-open');
  });

  it('Should call onHide for a native cancel event', () => {
    const onHideSpy = vi.fn();
    render(
      <Dialog show onHide={onHideSpy}>
        <strong>Message</strong>
      </Dialog>,
    );

    const event = new Event('cancel', { cancelable: true });
    getDialog().dispatchEvent(event);

    expect(event.defaultPrevented).toEqual(true);
    expect(onHideSpy).toHaveBeenCalledOnce();
  });
});
