import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Menu from '../src/Menu';
import { DropDirection } from '../src/MenuContext';
import InputGroup from '../src/InputGroup';

describe('<Menu>', () => {
  const dropdownChildren = [
    <Menu.Toggle id="test-id" key="toggle">
      Child Title
    </Menu.Toggle>,
    <Menu.Panel data-testid="menu" key="menu">
      <Menu.Item data-testid="item1">Item 1</Menu.Item>
      <Menu.Item>Item 2</Menu.Item>
      <Menu.Item>Item 3</Menu.Item>
      <Menu.Item>Item 4</Menu.Item>
    </Menu.Panel>,
  ];

  const simpleDropdown = <Menu>{dropdownChildren}</Menu>;

  it('renders a wrapper without Bootstrap 5 classes', () => {
    const { container } = render(simpleDropdown);
    const wrapper = container.firstElementChild!;

    expect(wrapper.tagName).toEqual('DIV');
    expect(wrapper.classList).toHaveLength(0);
    // The toggle and the .menu are siblings.
    expect(screen.getByText('Child Title').parentElement).toEqual(wrapper);
  });

  (
    [
      ['down', 'bottom-start'],
      ['up', 'top-start'],
      ['end', 'right-start'],
      ['start', 'left-start'],
      ['down-centered', 'bottom'],
      ['up-centered', 'top'],
    ] as const
  ).forEach(([drop, placement]) => {
    it(`sets data-bs-placement="${placement}" for drop="${drop}"`, () => {
      const { container } = render(
        <Menu show drop={drop as DropDirection}>
          <Menu.Toggle id="test-id">Child Title</Menu.Toggle>
          <Menu.Panel flip={false} data-testid="menu">
            <Menu.Item>Item 1</Menu.Item>
          </Menu.Panel>
        </Menu>,
      );

      expect(container.firstElementChild!.className).toEqual('show');
      expect(
        screen.getByTestId('menu').getAttribute('data-bs-placement'),
      ).toEqual(placement);
    });
  });

  it('renders toggle with Menu.Toggle', () => {
    render(simpleDropdown);

    const toggle = screen.getByText('Child Title');
    expect(toggle.getAttribute('aria-expanded')).toEqual('false');
  });

  it('forwards align="end" to menu', () => {
    const CustomPanel = React.forwardRef<any, any>(
      ({ show: _, close: _1, align, ...props }, ref) => (
        <div {...props} data-align={align} ref={ref} />
      ),
    );

    const { container } = render(
      <Menu align="end" show>
        <Menu.Toggle id="test-id" key="toggle">
          Child Title
        </Menu.Toggle>

        <Menu.Panel key="menu" as={CustomPanel}>
          <Menu.Item>Item 1</Menu.Item>
        </Menu.Panel>
      </Menu>,
    );

    expect(container.querySelector('[data-align="end"]')).toBeDefined();
  });

  it('toggles open/closed when clicked', () => {
    const { container } = render(simpleDropdown);
    const dropdown = container.firstElementChild!;
    const toggle = screen.getByText('Child Title');

    expect(dropdown.classList).not.toContain('show');
    fireEvent.click(toggle);
    expect(dropdown.classList).toContain('show');

    expect(screen.getByTestId('menu').classList).toContain('menu');
    expect(screen.getByTestId('menu').classList).toContain('show');

    fireEvent.click(toggle);
    expect(dropdown.classList).not.toContain('show');
    expect(toggle.getAttribute('aria-expanded')).toEqual('false');
  });

  it('closes when child Menu.Item is selected', () => {
    const onToggleSpy = vi.fn();

    const { container } = render(
      <Menu show onToggle={onToggleSpy}>
        <Menu.Toggle id="test-id" key="toggle">
          Child Title
        </Menu.Toggle>
        <Menu.Panel data-testid="menu" key="menu">
          <Menu.Item data-testid="item1">Item 1</Menu.Item>
          <Menu.Item>Item 2</Menu.Item>
          <Menu.Item>Item 3</Menu.Item>
          <Menu.Item>Item 4</Menu.Item>
        </Menu.Panel>
      </Menu>,
    );

    expect(container.firstElementChild!.classList).toContain('show');

    fireEvent.click(screen.getByTestId('item1'));
    expect(onToggleSpy).toHaveBeenCalledWith(false, expect.anything());
  });

  it('has aria-labelledby same id as toggle button', () => {
    render(
      <Menu show>
        <Menu.Toggle data-testid="toggle">Toggle</Menu.Toggle>
        <Menu.Panel data-testid="menu" key="menu">
          <Menu.Item data-testid="item1">Item 1</Menu.Item>
        </Menu.Panel>
      </Menu>,
    );

    expect(screen.getByTestId('toggle').id).toEqual(
      screen.getByTestId('menu').getAttribute('aria-labelledby'),
    );
  });

  describe('DOM event and source passed to onToggle', () => {
    it('passes open, event, and source correctly when opened with click', () => {
      const onToggleSpy = vi.fn();
      render(<Menu onToggle={onToggleSpy}>{dropdownChildren}</Menu>);

      expect(onToggleSpy).not.toHaveBeenCalled();

      fireEvent.click(screen.getByText('Child Title'));

      expect(onToggleSpy).toHaveBeenCalledOnce();
      expect(onToggleSpy).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ source: 'click' }),
      );
    });

    it('passes open, event, and source correctly when closed with click', () => {
      const onToggleSpy = vi.fn();
      render(
        <Menu show onToggle={onToggleSpy}>
          {dropdownChildren}
        </Menu>,
      );

      const toggle = screen.getByText('Child Title');

      expect(onToggleSpy).not.toHaveBeenCalled();

      fireEvent.click(toggle);

      expect(onToggleSpy).toHaveBeenCalledWith(
        false,
        expect.objectContaining({ source: 'click' }),
      );
    });

    it('passes open, event, and source correctly when child selected', () => {
      const onToggleSpy = vi.fn();
      render(
        <Menu onToggle={onToggleSpy}>
          <Menu.Toggle data-testid="toggle">Toggle</Menu.Toggle>
          <Menu.Panel>
            <Menu.Item eventKey={1} data-testid="item1">
              Item 1
            </Menu.Item>
          </Menu.Panel>
        </Menu>,
      );

      fireEvent.click(screen.getByTestId('toggle'));

      expect(onToggleSpy).toHaveBeenCalledOnce();

      fireEvent.click(screen.getByTestId('item1'));

      expect(onToggleSpy).toHaveBeenCalledTimes(2);
      expect(onToggleSpy).toHaveBeenCalledWith(
        false,
        expect.objectContaining({ source: 'select' }),
      );
    });

    it('passes open, event, and source correctly when opened with keydown', () => {
      const onToggleSpy = vi.fn();
      render(
        <Menu onToggle={onToggleSpy}>
          <Menu.Toggle data-testid="toggle">Toggle</Menu.Toggle>
          <Menu.Panel>
            <Menu.Item eventKey={1} data-testid="item1">
              Item 1
            </Menu.Item>
          </Menu.Panel>
        </Menu>,
      );

      fireEvent.keyDown(screen.getByTestId('toggle'), { key: 'ArrowDown' });

      expect(onToggleSpy).toHaveBeenCalledOnce();
      expect(onToggleSpy).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ source: 'keydown' }),
      );
    });

    it('Should render .show on the dropdown toggle when outside an InputGroup', () => {
      render(<Menu show>{dropdownChildren}</Menu>);
      expect(screen.getByText('Child Title').classList).toContain('show');
    });
  });

  it('should use each components bsPrefix', () => {
    render(
      <Menu defaultShow bsPrefix="my-dropdown" data-testid="dropdown">
        <Menu.Toggle data-testid="toggle" bsPrefix="my-toggle">
          Child Title
        </Menu.Toggle>
        <Menu.Panel data-testid="menu" bsPrefix="my-menu">
          <Menu.Item>Item 1</Menu.Item>
        </Menu.Panel>
      </Menu>,
    );

    expect(screen.getByTestId('dropdown').classList).toContain('show');
    // Bootstrap 6 has no wrapper or toggle class; the Menu prefix is used
    // for its items and the toggle prefix for split toggles.
    expect(screen.getByTestId('dropdown').classList).not.toContain(
      'my-dropdown',
    );
    expect(screen.getByTestId('toggle').classList).not.toContain('my-toggle');
    expect(screen.getByTestId('menu').classList).toContain('my-menu');
  });

  it('Should have div as default component', () => {
    render(
      <Menu defaultShow bsPrefix="my-dropdown" data-testid="dropdown">
        <Menu.Toggle data-testid="toggle" bsPrefix="my-toggle">
          Child Title
        </Menu.Toggle>
        <Menu.Panel data-testid="menu" bsPrefix="my-menu">
          <Menu.Item>Item 1</Menu.Item>
        </Menu.Panel>
      </Menu>,
    );

    expect(screen.getByTestId('dropdown').tagName).toEqual('DIV');
  });

  it('Should also accept a custom component', () => {
    const customComponent = React.forwardRef<any, any>(
      (
        {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          show,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          close,
          ...props
        },
        ref,
      ) => <div ref={ref} id="custom-component" {...props} />,
    );
    render(
      <Menu.Panel data-testid="menu" show as={customComponent}>
        <Menu.Item>Example Item</Menu.Item>
      </Menu.Panel>,
    );

    expect(screen.getByTestId('menu').id).toEqual('custom-component');
  });

  describe('InputGroup Menus', () => {
    it('should not render a .dropdown element when inside input group', () => {
      render(
        <InputGroup>
          <Menu data-testid="dropdown">{dropdownChildren}</Menu>
        </InputGroup>,
      );

      expect(screen.queryByTestId('dropdown')).toBeNull();
    });

    it('should render .show on the dropdown toggle', () => {
      render(
        <InputGroup>
          <Menu show>{dropdownChildren}</Menu>
        </InputGroup>,
      );

      expect(screen.getByText('Child Title').classList).toContain('show');
    });
  });

  describe('autoClose behaviour', () => {
    describe('autoClose="true"', () => {
      it('should close on outer click', () => {
        const onToggleSpy = vi.fn();

        render(
          <Menu defaultShow onToggle={onToggleSpy} autoClose>
            <Menu.Toggle>Toggle</Menu.Toggle>
            <Menu.Panel>
              <Menu.Item>Item 1</Menu.Item>
            </Menu.Panel>
          </Menu>,
        );

        fireEvent.click(document.body);

        expect(onToggleSpy).toHaveBeenCalledWith(false, expect.anything());
      });
    });

    describe('autoClose="inside"', () => {
      it('should close on child selection', () => {
        const onToggleSpy = vi.fn();

        render(
          <Menu defaultShow onToggle={onToggleSpy} autoClose="inside">
            <Menu.Toggle>Toggle</Menu.Toggle>
            <Menu.Panel>
              <Menu.Item data-testid="item1">Item 1</Menu.Item>
            </Menu.Panel>
          </Menu>,
        );

        fireEvent.click(screen.getByTestId('item1'));

        expect(onToggleSpy).toHaveBeenCalledWith(false, expect.anything());
      });

      it('should not close on outer click', () => {
        const onToggleSpy = vi.fn();

        render(
          <Menu defaultShow onToggle={onToggleSpy} autoClose="inside">
            <Menu.Toggle>Toggle</Menu.Toggle>
            <Menu.Panel>
              <Menu.Item>Item 1</Menu.Item>
            </Menu.Panel>
          </Menu>,
        );

        fireEvent.click(document.body);

        expect(onToggleSpy).not.toHaveBeenCalled();
      });
    });

    describe('autoClose="outside"', () => {
      it('should not close on child selection', () => {
        const onToggleSpy = vi.fn();

        render(
          <Menu defaultShow onToggle={onToggleSpy} autoClose="outside">
            <Menu.Toggle>Toggle</Menu.Toggle>
            <Menu.Panel>
              <Menu.Item data-testid="item1">Item 1</Menu.Item>
            </Menu.Panel>
          </Menu>,
        );

        fireEvent.click(screen.getByTestId('item1'));

        expect(onToggleSpy).not.toHaveBeenCalled();
      });

      it('should close on outer click', () => {
        const onToggleSpy = vi.fn();

        render(
          <Menu defaultShow onToggle={onToggleSpy} autoClose="outside">
            <Menu.Toggle>Toggle</Menu.Toggle>
            <Menu.Panel>
              <Menu.Item>Item 1</Menu.Item>
            </Menu.Panel>
          </Menu>,
        );

        fireEvent.click(document.body);

        expect(onToggleSpy).toHaveBeenCalledWith(false, expect.anything());
      });
    });

    describe('autoClose="false"', () => {
      it('should not close on child selection', () => {
        const onToggleSpy = vi.fn();

        render(
          <Menu defaultShow onToggle={onToggleSpy} autoClose={false}>
            <Menu.Toggle>Toggle</Menu.Toggle>
            <Menu.Panel>
              <Menu.Item data-testid="item1">Item 1</Menu.Item>
            </Menu.Panel>
          </Menu>,
        );

        fireEvent.click(screen.getByTestId('item1'));

        expect(onToggleSpy).not.toHaveBeenCalled();
      });

      it('should not close on outer click', () => {
        const onToggleSpy = vi.fn();

        render(
          <Menu defaultShow onToggle={onToggleSpy} autoClose={false}>
            <Menu.Toggle>Toggle</Menu.Toggle>
            <Menu.Panel>
              <Menu.Item>Item 1</Menu.Item>
            </Menu.Panel>
          </Menu>,
        );

        fireEvent.click(document.body);

        expect(onToggleSpy).not.toHaveBeenCalled();
      });
    });
  });
});
