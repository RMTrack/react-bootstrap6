import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import FormRange from '../src/FormRange';
import FormGroup from '../src/FormGroup';

describe('<FormRange>', () => {
  it('should render correctly', () => {
    render(
      <FormRange
        id="foo"
        name="bar"
        className="my-control"
        data-testid="test-id"
      />,
    );
    const element = screen.getByTestId('test-id');
    expect(element.tagName).toEqual('INPUT');
    expect(element.id).toEqual('foo');
    expect(element.classList).toHaveLength(2);
    expect(element.classList).toContain('form-range-input');
    expect(element.classList).toContain('my-control');
    expect(element.parentElement!.className).toEqual('form-range');
    expect(element.getAttribute('name')).toEqual('bar');
    expect(element.getAttribute('type')).toEqual('range');
  });

  it('should render controlId as id correctly', () => {
    render(
      <FormGroup controlId="control-id">
        <FormRange data-testid="test-id" />
      </FormGroup>,
    );
    const element = screen.getByTestId('test-id');
    expect(element.id).toEqual('control-id');
  });

  it('should override controlId correctly', () => {
    render(
      <FormGroup controlId="control-id">
        <FormRange id="overridden-id" data-testid="test-id" />
      </FormGroup>,
    );
    const element = screen.getByTestId('test-id');
    expect(element.id).toEqual('overridden-id');
  });

  it('should keep the --bs-range-fill of the wrapper in sync', () => {
    render(
      <FormRange data-testid="test-id" min={0} max={200} defaultValue={50} />,
    );
    const input = screen.getByTestId('test-id') as HTMLInputElement;
    const wrapper = input.parentElement!;
    expect(wrapper.style.getPropertyValue('--bs-range-fill')).toEqual('0.25');

    fireEvent.input(input, { target: { value: '100' } });
    expect(wrapper.style.getPropertyValue('--bs-range-fill')).toEqual('0.5');
  });

  it('should support isInvalid', () => {
    render(<FormRange isInvalid data-testid="test-id" />);

    expect(screen.getByTestId('test-id').classList).toContain('is-invalid');
  });
});
