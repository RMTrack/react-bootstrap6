import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import DialogBody from '../src/DialogBody';

describe('DialogBody', () => {
  it('uses "div" by default', () => {
    const { getByTestId } = render(
      <DialogBody data-testid="test-modal" className="custom-class">
        <strong>Content</strong>
      </DialogBody>,
    );

    const elem = getByTestId('test-modal');
    expect(elem.tagName).toEqual('DIV');
    expect(elem.classList).toContain('dialog-body');
    expect(elem.classList).toContain('custom-class');
    expect(elem.querySelector('strong')!.textContent).toEqual('Content');
  });

  it('should allow custom elements instead of "div"', () => {
    const { getByTestId } = render(
      <DialogBody data-testid="test-modal" as="section">
        <strong>Content</strong>
      </DialogBody>,
    );
    expect(getByTestId('test-modal').classList).toContain('dialog-body');
    expect(getByTestId('test-modal').tagName).toEqual('SECTION');
  });
});
