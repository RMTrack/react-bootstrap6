import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ToggleButton from '../src/ToggleButton';

describe('ToggleButton', () => {
  it('should forward refs to the label', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(
      <ToggleButton id="id" ref={ref} value={1}>
        Option
      </ToggleButton>,
    );

    expect(ref.current!.tagName).toEqual('LABEL');
  });

  it('should add an inputRef', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <ToggleButton id="id" inputRef={ref} value={1}>
        Option
      </ToggleButton>,
    );

    expect(ref.current!.tagName).toEqual('INPUT');
  });

  it('should not have a role on the label button', () => {
    render(
      <ToggleButton id="id" value={1}>
        Option
      </ToggleButton>,
    );

    expect(screen.getByText('Option').getAttribute('role')).not.toBeTruthy();
  });
  it('should nest the input in a .btn-check label', () => {
    render(
      <ToggleButton value={1} type="checkbox" variant="outline-primary">
        Option
      </ToggleButton>,
    );

    const label = screen.getByText('Option');
    expect(label.tagName).toEqual('LABEL');
    expect(label.classList).toContain('btn-check');
    expect(label.classList).toContain('btn-outline');
    expect(label.classList).toContain('theme-primary');
    expect(label.hasAttribute('for')).toEqual(false);

    const input = label.querySelector('input')!;
    expect(input.type).toEqual('checkbox');
    expect(input.classList).toHaveLength(0);
  });
});
