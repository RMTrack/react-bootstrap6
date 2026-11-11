import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionHeader } from '../src';

describe('<AccordionHeader>', () => {
  it('should render a summary by default', () => {
    render(<AccordionHeader data-testid="header" />);

    const header = screen.getByTestId('header');
    expect(header.tagName).toEqual('SUMMARY');
    expect(header.classList).toContain('accordion-header');
  });

  it('should allow rendering as a different component', () => {
    render(<AccordionHeader data-testid="header" as="div" />);

    expect(screen.getByTestId('header').tagName).toEqual('DIV');
  });

  it('should apply aria-controls to the summary', () => {
    render(<AccordionHeader data-testid="header" aria-controls="test" />);

    expect(screen.getByTestId('header').getAttribute('aria-controls')).toEqual(
      'test',
    );
  });

  it('should call onClick', () => {
    const onClickSpy = vi.fn();
    render(<AccordionHeader data-testid="header" onClick={onClickSpy} />);

    fireEvent.click(screen.getByTestId('header'));

    expect(onClickSpy).toHaveBeenCalledOnce();
  });

  it('should prevent the native details toggle', () => {
    render(
      <Accordion>
        <Accordion.Item eventKey="0" data-testid="item">
          <AccordionHeader data-testid="header" />
        </Accordion.Item>
      </Accordion>,
    );

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    screen.getByTestId('header').dispatchEvent(event);

    expect(event.defaultPrevented).toEqual(true);
  });

  it('should disable the header when disabled prop is true', async () => {
    const user = userEvent.setup();
    const onClickFn = vi.fn();
    const onSelectFn = vi.fn();
    render(
      <Accordion onSelect={onSelectFn}>
        <Accordion.Item eventKey="0" data-testid="item">
          <AccordionHeader data-testid="header" disabled onClick={onClickFn} />
        </Accordion.Item>
      </Accordion>,
    );

    const header = screen.getByTestId('header');
    expect(header.getAttribute('aria-disabled')).toEqual('true');
    expect(header.getAttribute('tabindex')).toEqual('-1');

    await user.click(header);

    expect(onClickFn).not.toHaveBeenCalled();
    expect(onSelectFn).not.toHaveBeenCalled();
    expect((screen.getByTestId('item') as HTMLDetailsElement).open).toEqual(
      false,
    );
  });
});
