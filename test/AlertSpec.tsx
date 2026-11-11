import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Alert from '../src/Alert';

describe('<Alert>', () => {
  it('Should output a alert with message', () => {
    render(
      <Alert data-testid="test-alert">
        <strong>Message</strong>
      </Alert>,
    );
    expect(screen.getByTestId('test-alert').children.length).toEqual(1);
    expect(screen.getByTestId('test-alert').children[0].tagName).toEqual(
      'STRONG',
    );
  });

  it('Should render the close button after the content', () => {
    render(
      <Alert data-testid="test-alert" dismissible>
        <strong>Message</strong>
      </Alert>,
    );
    const alert = screen.getByTestId('test-alert');
    // Bootstrap 6 has no .alert-dismissible; the flex layout places the button.
    expect(alert.classList).not.toContain('alert-dismissible');
    const button = alert.lastElementChild!;
    expect(button.classList).toContain('btn-close');
    expect(button.classList).toContain('ms-auto');
  });

  it('Should call onClose callback on dismiss click', () => {
    const onCloseSpy = vi.fn();
    render(
      <Alert dismissible data-testid="test-alert" onClose={onCloseSpy}>
        Message
      </Alert>,
    );
    fireEvent.click(screen.getByLabelText('Close alert'));
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });

  it('Should default to variant="primary"', () => {
    render(<Alert data-testid="test-alert">Message</Alert>);
    expect(screen.getByTestId('test-alert').classList).toContain(
      'theme-primary',
    );
  });

  it('Should use variant class', () => {
    render(
      <Alert variant="danger" data-testid="test-alert">
        Message
      </Alert>,
    );
    expect(screen.getByTestId('test-alert').classList).toContain(
      'theme-danger',
    );
  });

  it('Should not have variant class when variant=null', () => {
    render(
      <Alert variant={null as any} data-testid="test-alert">
        Message
      </Alert>,
    );
    expect(screen.getByTestId('test-alert').classList).not.toContain(
      'theme-primary',
    );
  });

  it('should forward refs to the alert', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Alert ref={ref} data-testid="test-alert">
        message
      </Alert>,
    );
    expect(screen.getByTestId('test-alert').tagName).toEqual('DIV');
  });

  it('should not have fade class when transition=false', () => {
    render(
      <Alert transition={false} data-testid="test-alert">
        Message
      </Alert>,
    );
    expect(screen.getByTestId('test-alert').classList).not.toContain('fade');
  });

  it('should spread props to alert when transition=false', () => {
    const alertId = 'alert-id';
    render(
      <Alert transition={false} id={alertId} data-testid="test-alert">
        Message
      </Alert>,
    );
    expect(screen.getByTestId('test-alert').getAttribute('id')).toEqual(
      alertId,
    );
  });

  it('should spread props to alert when transition=true', () => {
    const alertId = 'alert-id';
    render(
      <Alert transition id={alertId} data-testid="test-alert">
        Message
      </Alert>,
    );
    expect(screen.getByTestId('test-alert').getAttribute('id')).toEqual(
      alertId,
    );
  });

  it('should not use .fade when transition=true', () => {
    render(
      <Alert variant="danger" transition data-testid="test-alert">
        Message
      </Alert>,
    );
    expect(screen.getByTestId('test-alert').classList).not.toContain('fade');
  });

  it('should add .hiding while closing', async () => {
    const { rerender } = render(
      <Alert data-testid="test-alert">Message</Alert>,
    );
    const alert = screen.getByTestId('test-alert');

    rerender(
      <Alert data-testid="test-alert" show={false}>
        Message
      </Alert>,
    );

    expect(alert.classList).toContain('hiding');
    await waitFor(() => expect(alert.isConnected).toEqual(false));
  });

  it('should render null when transition and show are false', () => {
    const { container } = render(
      <Alert
        variant="danger"
        transition={false}
        show={false}
        data-testid="test-alert"
      >
        Message
      </Alert>,
    );
    expect(container.innerHTML).toEqual('');
  });

  describe('Web Accessibility', () => {
    it('Should have alert role', () => {
      render(<Alert data-testid="test-alert">Message</Alert>);
      expect(screen.getByTestId('test-alert').getAttribute('role')).toEqual(
        'alert',
      );
    });
  });

  describe('Alert alert-heading', () => {
    it('Should have alert-heading', () => {
      render(
        <Alert>
          <Alert.Heading data-testid="test-alert">Well done</Alert.Heading>
          Message
        </Alert>,
      );
      expect(screen.getByTestId('test-alert').classList).toContain(
        'alert-heading',
      );
    });

    it('Should have div styled as an h4 by default', () => {
      render(
        <Alert>
          <Alert.Heading data-testid="test-alert">Well done</Alert.Heading>
          Message
        </Alert>,
      );
      expect(screen.getByTestId('test-alert').classList).toContain('h4');
    });

    it('Should support Heading as as prop', () => {
      render(
        <Alert>
          <Alert.Heading as="h1" data-testid="test-alert">
            Well done
          </Alert.Heading>
          Message
        </Alert>,
      );
      expect(screen.getByTestId('test-alert').tagName).toEqual('H1');
    });
  });
});
