import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Accordion from '../src/Accordion';
import Menu from '../src/Menu';
import ListGroup from '../src/ListGroup';
import Nav from '../src/Nav';

function getDetails(testId: string) {
  return screen.getByTestId(testId) as HTMLDetailsElement;
}

describe('<Accordion>', () => {
  it('should output a div', () => {
    render(<Accordion data-testid="test" />);

    expect(screen.getByTestId('test').tagName).toEqual('DIV');
  });

  it('should render flush prop', () => {
    render(<Accordion flush data-testid="test" />);

    const node = screen.getByTestId('test');
    expect(node.classList).toContain('accordion');
    expect(node.classList).toContain('accordion-flush');
  });

  it('should render size prop', () => {
    render(<Accordion size="sm" data-testid="test" />);

    expect(screen.getByTestId('test').classList).toContain('accordion-sm');
  });

  it('should render gap prop', () => {
    render(<Accordion gap data-testid="test" />);

    expect(screen.getByTestId('test').classList).toContain('accordion-gap');
  });

  it('should render Bootstrap 6 details/summary markup', () => {
    render(
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header>Item 1</Accordion.Header>
          <Accordion.Body data-testid="body-0">body text</Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    const item = getDetails('item-0');
    expect(item.tagName).toEqual('DETAILS');
    expect(item.classList).toContain('accordion-item');

    const summary = item.firstElementChild!;
    expect(summary.tagName).toEqual('SUMMARY');
    expect(summary.classList).toContain('accordion-header');
    expect(summary.textContent).toEqual('Item 1');

    const icon = summary.querySelector('svg')!;
    expect(icon.classList).toContain('accordion-icon');
    expect(icon.getAttribute('aria-hidden')).toEqual('true');

    const body = screen.getByTestId('body-0');
    expect(body.parentElement).toEqual(item);
    expect(body.classList).toContain('accordion-body');

    expect(item.querySelector('.accordion-button')).toBeNull();
    expect(item.querySelector('.accordion-collapse')).toBeNull();
  });

  it('should only have second item collapsed', () => {
    render(
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header />
          <Accordion.Body>body text</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" data-testid="item-1">
          <Accordion.Header />
          <Accordion.Body>body text</Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    expect(getDetails('item-0').open).toEqual(true);
    expect(getDetails('item-1').open).toEqual(false);
  });

  it('should group exclusive items with a shared name', () => {
    render(
      <Accordion>
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header />
        </Accordion.Item>
        <Accordion.Item eventKey="1" data-testid="item-1">
          <Accordion.Header />
        </Accordion.Item>
      </Accordion>,
    );

    const { name } = getDetails('item-0');
    expect(name).toBeTruthy();
    expect(getDetails('item-1').name).toEqual(name);
  });

  it('should use a different name for each accordion', () => {
    render(
      <>
        <Accordion>
          <Accordion.Item eventKey="0" data-testid="a">
            <Accordion.Header />
          </Accordion.Item>
        </Accordion>
        <Accordion>
          <Accordion.Item eventKey="0" data-testid="b">
            <Accordion.Header />
          </Accordion.Item>
        </Accordion>
      </>,
    );

    expect(getDetails('a').name).not.toEqual(getDetails('b').name);
  });

  it('should not set a name when alwaysOpen', () => {
    render(
      <Accordion alwaysOpen>
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header />
        </Accordion.Item>
      </Accordion>,
    );

    expect(getDetails('item-0').hasAttribute('name')).toEqual(false);
  });

  it('should expand next item and collapse current item on click', () => {
    const onClickSpy = vi.fn();

    render(
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header onClick={onClickSpy} />
          <Accordion.Body>body text</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" data-testid="item-1">
          <Accordion.Header onClick={onClickSpy}>
            Button item 1
          </Accordion.Header>
          <Accordion.Body>body text</Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('Button item 1'));

    expect(onClickSpy).toBeCalledTimes(1);
    expect(getDetails('item-0').open).toEqual(false);
    expect(getDetails('item-1').open).toEqual(true);
  });

  it('should collapse current item on click', () => {
    const onClickSpy = vi.fn();

    render(
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header onClick={onClickSpy}>
            Button item 0
          </Accordion.Header>
          <Accordion.Body>body text</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" data-testid="item-1">
          <Accordion.Header onClick={onClickSpy} />
          <Accordion.Body>body text</Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('Button item 0'));

    expect(onClickSpy).toBeCalledTimes(1);
    expect(getDetails('item-0').open).toEqual(false);
    expect(getDetails('item-1').open).toEqual(false);
  });

  it('should not toggle natively when the active key is controlled', async () => {
    const onSelectSpy = vi.fn();

    render(
      <Accordion activeKey="0" onSelect={onSelectSpy}>
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header>header0</Accordion.Header>
          <Accordion.Body>body</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" data-testid="item-1">
          <Accordion.Header>header1</Accordion.Header>
          <Accordion.Body>body</Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('header1'));

    expect(onSelectSpy).toHaveBeenCalledWith('1', expect.anything());

    // Give a native toggle event a chance to fire.
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(getDetails('item-0').open).toEqual(true);
    expect(getDetails('item-1').open).toEqual(false);
  });

  it('should sync the active key when the browser opens an item', async () => {
    const onSelectSpy = vi.fn();

    render(
      <Accordion defaultActiveKey="0" onSelect={onSelectSpy}>
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header>header0</Accordion.Header>
          <Accordion.Body>body</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" data-testid="item-1">
          <Accordion.Header>header1</Accordion.Header>
          <Accordion.Body>body</Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    // e.g. find-in-page revealing a match in a collapsed item.
    getDetails('item-1').open = true;

    await waitFor(() =>
      expect(onSelectSpy).toHaveBeenCalledWith('1', expect.anything()),
    );
    expect(onSelectSpy).toHaveBeenCalledTimes(1);
    expect(getDetails('item-1').open).toEqual(true);
    expect(getDetails('item-0').open).toEqual(false);
  });

  it('should sync the active key when the browser closes an item', async () => {
    const onSelectSpy = vi.fn();

    render(
      <Accordion defaultActiveKey="0" onSelect={onSelectSpy}>
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header>header0</Accordion.Header>
          <Accordion.Body>body</Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    getDetails('item-0').open = false;

    await waitFor(() =>
      expect(onSelectSpy).toHaveBeenCalledWith(null, expect.anything()),
    );
  });

  // https://github.com/react-bootstrap/react-bootstrap/issues/4176
  it('Should not close accordion when child dropdown clicked', () => {
    render(
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header />
          <Accordion.Body>
            <Menu show>
              <Menu.Toggle id="dropdown-test">Menu Toggle</Menu.Toggle>
              <Menu.Panel>
                <Menu.Item href="#">Menu Action</Menu.Item>
              </Menu.Panel>
            </Menu>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('Menu Action'));

    expect(getDetails('item-0').open).toEqual(true);
  });

  it('Should not close accordion when child ListGroup clicked', () => {
    render(
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header />
          <Accordion.Body>
            <ListGroup defaultActiveKey="#link1">
              <ListGroup.Item action href="#link1">
                List Group Item 1
              </ListGroup.Item>
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('List Group Item 1'));

    expect(getDetails('item-0').open).toEqual(true);
  });

  it('Should not close accordion when child Nav clicked', () => {
    render(
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header />
          <Accordion.Body>
            <Nav activeKey="/home">
              <Nav.Item>
                <Nav.Link href="#">Nav Link Item 0</Nav.Link>
              </Nav.Item>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('Nav Link Item 0'));

    expect(getDetails('item-0').open).toEqual(true);
  });

  it('should allow multiple items to stay open', () => {
    const onSelectSpy = vi.fn();

    render(
      <Accordion onSelect={onSelectSpy} alwaysOpen>
        <Accordion.Item eventKey="0" data-testid="item-0">
          <Accordion.Header>header0</Accordion.Header>
          <Accordion.Body>body</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" data-testid="item-1">
          <Accordion.Header>header1</Accordion.Header>
          <Accordion.Body>body</Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('header0'));
    fireEvent.click(screen.getByText('header1'));

    expect(onSelectSpy).toHaveBeenCalledWith(['0', '1'], expect.anything());
    expect(getDetails('item-0').open).toEqual(true);
    expect(getDetails('item-1').open).toEqual(true);
  });

  it('should remove only one of the active indices', () => {
    const onSelectSpy = vi.fn();

    const { getByText } = render(
      <Accordion
        onSelect={onSelectSpy}
        defaultActiveKey={['0', '1']}
        alwaysOpen
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>header0</Accordion.Header>
          <Accordion.Body>body</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>header1</Accordion.Header>
          <Accordion.Body>body</Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    fireEvent.click(getByText('header1'));

    expect(onSelectSpy).toHaveBeenCalledWith(['0'], expect.anything());
  });

  it('should call onToggle of the item', async () => {
    const onToggleSpy = vi.fn();

    render(
      <Accordion>
        <Accordion.Item eventKey="0" onToggle={onToggleSpy}>
          <Accordion.Header>header0</Accordion.Header>
          <Accordion.Body>body</Accordion.Body>
        </Accordion.Item>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('header0'));

    await waitFor(() => expect(onToggleSpy).toHaveBeenCalled());
  });
});
