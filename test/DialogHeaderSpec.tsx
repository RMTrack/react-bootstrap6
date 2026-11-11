import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import DialogHeader from '../src/DialogHeader';

describe('DialogHeader', () => {
  it('uses "div" by default', () => {
    render(
      <DialogHeader data-testid="test-modal" className="custom-class">
        <strong>Content</strong>
      </DialogHeader>,
    );

    expect(screen.getByTestId('test-modal').tagName).toEqual('DIV');
    expect(screen.getByTestId('test-modal').classList).toContain(
      'dialog-header',
    );
    expect(screen.getByTestId('test-modal').classList).toContain(
      'custom-class',
    );
    expect(
      screen.getByTestId('test-modal').querySelector('strong')!.textContent,
    ).toEqual('Content');
  });

  it('has closeButton without a containing Dialog and renders', () => {
    render(<DialogHeader data-testid="test-modal" closeButton />);

    expect(screen.getByTestId('test-modal').tagName).toEqual('DIV');
    expect(
      screen.getByTestId('test-modal').querySelector('button'),
    ).toBeDefined();
  });

  it('Should trigger onHide when modal is closed', () => {
    const onHideSpy = vi.fn();
    render(
      <DialogHeader data-testid="test-modal" closeButton onHide={onHideSpy} />,
    );

    fireEvent.click(screen.getByTestId('test-modal').querySelector('button')!);
    expect(onHideSpy).toHaveBeenCalledOnce();
  });
});
