import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, RenderResult, waitFor } from '@testing-library/react';
import Collapse, { CollapseProps } from '../src/Collapse';

describe('<Collapse>', () => {
  class Component extends React.Component<
    React.PropsWithChildren<Omit<CollapseProps, 'children'>>
  > {
    render() {
      const { children, ...props } = this.props;

      return (
        <Collapse data-testid="collapse-component" {...props} {...this.state}>
          <div>
            <span data-testid={props.in ? 'status-show' : 'status-hide'} />
            {children}
          </div>
        </Collapse>
      );
    }
  }

  it('should not throw an error with StrictMode', () => {
    render(
      <React.StrictMode>
        <Component in>Panel content</Component>
      </React.StrictMode>,
    );
  });

  it('Should default to collapsed', () => {
    render(<Component data-testid="test">Panel content</Component>);

    expect(screen.getByTestId('test').classList).not.toContain('show');
    expect(screen.getByTestId('status-hide')).toBeDefined();
  });

  it('Should have collapse class', () => {
    render(<Component>Panel content</Component>);

    expect(screen.getByTestId('collapse-component').classList).toContain(
      'collapse',
    );
  });

  // Bootstrap 6 animates the size in CSS (interpolate-size): .show is the
  // only state class, without .collapsing or inline sizes.
  describe('from collapsed to expanded', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
      renderResult = render(<Component>Panel content</Component>);
    });

    it('Should add show at once', () => {
      renderResult.rerender(<Component in>Panel content</Component>);

      const collapse = screen.getByTestId('collapse-component');
      expect(collapse.className).toEqual('collapse show');
      expect(collapse.style.height).toEqual('');
    });

    it('Should fire onEntered after the transition', async () => {
      const onEntered = vi.fn();
      renderResult.rerender(
        <Component in onEntered={onEntered}>
          Panel content
        </Component>,
      );

      await waitFor(() => expect(onEntered).toHaveBeenCalledOnce());
      expect(screen.getByTestId('collapse-component').className).toEqual(
        'collapse show',
      );
    });
  });

  describe('from expanded to collapsed', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
      renderResult = render(<Component in>Panel content</Component>);
    });

    it('Should remove show at once', () => {
      renderResult.rerender(<Component in={false}>Panel content</Component>);

      const collapse = screen.getByTestId('collapse-component');
      expect(collapse.className).toEqual('collapse');
      expect(collapse.classList).not.toContain('collapsing');
      expect(collapse.style.height).toEqual('');
    });

    it('Should fire onExited after the transition', async () => {
      const onExited = vi.fn();
      renderResult.rerender(
        <Component in={false} onExited={onExited}>
          Panel content
        </Component>,
      );

      await waitFor(() => expect(onExited).toHaveBeenCalledOnce());
    });
  });

  describe('expanded', () => {
    it('Should have collapse and in class', () => {
      render(<Component in>Panel content</Component>);

      const node = screen.getByTestId('collapse-component');
      expect(node.classList).toContain('collapse');
      expect(node.classList).toContain('show');
    });
  });

  describe('dimension', () => {
    it('Should not have width in class', () => {
      render(<Component>Panel content</Component>);

      const node = screen.getByTestId('collapse-component');
      expect(node.className.includes('width')).toEqual(false);
    });

    it('Should have collapse-horizontal in class', () => {
      render(<Component dimension={() => 'width'}>Panel content</Component>);

      const node = screen.getByTestId('collapse-component');
      expect(node.classList).toContain('collapse-horizontal');
    });
  });

  describe('with a role', () => {
    it('sets aria-expanded true when expanded', () => {
      const { getByRole } = render(
        <Component role="menuitem" in>
          Panel content
        </Component>,
      );

      expect(getByRole('menuitem', { expanded: true })).toBeDefined();
    });

    it('sets aria-expanded false when collapsed', () => {
      const { getByRole } = render(
        <Component role="menuitem" in={false}>
          Panel content
        </Component>,
      );

      expect(getByRole('menuitem', { expanded: false })).toBeDefined();
    });
  });
});
