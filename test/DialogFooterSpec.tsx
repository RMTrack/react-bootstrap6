import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DialogFooter from '../src/DialogFooter';

describe('DialogFooter', () => {
  it('uses "div" by default', () => {
    render(
      <DialogFooter data-testid="test-modal" className="custom-class">
        <strong>Content</strong>
      </DialogFooter>,
    );

    const elem = screen.getByTestId('test-modal');
    expect(elem.tagName).toEqual('DIV');
    expect(elem.classList).toContain('dialog-footer');
    expect(elem.classList).toContain('custom-class');
    expect(elem.querySelector('strong')!.textContent).toEqual('Content');
  });

  it('should allow custom elements instead of "div"', () => {
    render(
      <DialogFooter data-testid="test-modal" as="section">
        <strong>Content</strong>
      </DialogFooter>,
    );
    expect(screen.getByTestId('test-modal').classList).toContain(
      'dialog-footer',
    );
    expect(screen.getByTestId('test-modal').tagName).toEqual('SECTION');
  });
});
