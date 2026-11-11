import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DialogTitle from '../src/DialogTitle';

describe('DialogTitle', () => {
  it('uses "h5" by default', () => {
    render(
      <DialogTitle data-testid="test-modal" className="custom-class">
        <strong>Content</strong>
      </DialogTitle>,
    );

    const elem = screen.getByTestId('test-modal');
    expect(elem.tagName).toEqual('H5');
    expect(elem.classList).toContain('dialog-title');
    expect(elem.classList).toContain('custom-class');
    expect(elem.querySelector('strong')!.textContent!).toEqual('Content');
  });

  it('should allow custom elements instead of "h5"', () => {
    render(
      <DialogTitle data-testid="test-modal" as="h4">
        <strong>Content</strong>
      </DialogTitle>,
    );

    expect(screen.getByTestId('test-modal').classList).toContain(
      'dialog-title',
    );
    expect(screen.getByTestId('test-modal').tagName).toEqual('H4');
  });
});
