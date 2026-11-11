import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Toast from '../src/Toast';

describe('Toast.Header', () => {
  it('will pass all props to the created div and renders its children', () => {
    const { container } = render(
      <Toast.Header>
        <strong>content</strong>
      </Toast.Header>,
    );
    expect(container.firstElementChild!.tagName).toEqual('DIV');

    expect(container.firstElementChild!.firstElementChild!.tagName).toEqual(
      'STRONG',
    );

    expect(container.firstElementChild!.classList).toContain('toast-header');
  });
});
