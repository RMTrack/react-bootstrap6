import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Button from '../src/Button';
import Menu from '../src/Menu';

describe('<Menu.Item>', () => {
  it('renders divider', () => {
    render(<Menu.Divider />);
    screen.getByRole('separator');
  });

  it('renders divider className and style', () => {
    render(<Menu.Divider className="foo bar" style={{ height: '100px' }} />);

    const node = screen.getByRole('separator');
    expect(node.className).toMatch(/\bfoo bar menu-divider\b/);
    expect(node.style.height).toEqual('100px');
  });

  it('renders header', () => {
    render(<Menu.Header>Header text</Menu.Header>);

    expect(screen.getByRole('heading').textContent).toEqual('Header text');
  });

  it('renders header className and style', () => {
    render(
      <Menu.Header className="foo bar" style={{ height: '100px' }}>
        Header text
      </Menu.Header>,
    );

    const node = screen.getByText('Header text');
    expect(node.className).toMatch(/\bfoo bar menu-header\b/);
  });

  it('renders Menu.Text', () => {
    render(<Menu.Text>My text</Menu.Text>);

    expect(screen.getByText('My text').className).toEqual('menu-text');
  });

  it('renders Menu.Text className and style', () => {
    render(
      <Menu.Text className="foo bar" style={{ height: '100px' }}>
        My text
      </Menu.Text>,
    );

    const node = screen.getByText('My text');
    expect(node.className).toMatch(/\bfoo bar menu-text\b/);
    expect(node.style.height).toEqual('100px');
  });

  it('renders menu item link', () => {
    const onKeyDownSpy = vi.fn();

    render(
      <Menu.Item onKeyDown={onKeyDownSpy} href="/herpa-derpa">
        Item
      </Menu.Item>,
    );

    const node = screen.getByText('Item');
    expect(node.getAttribute('href')!).toEqual('/herpa-derpa');

    fireEvent.keyDown(node, { key: 'a' });
    expect(onKeyDownSpy).toHaveBeenCalled();
  });

  it('should render as a button when set', () => {
    const { getByTestId } = render(
      <Menu.Item as={Button} variant="success" data-testid="item" />,
    );

    expect(getByTestId('item').classList).toContain('menu-item');
    expect(getByTestId('item').classList).toContain('btn-solid');
    expect(getByTestId('item').classList).toContain('theme-success');
  });

  it('should pass through props', () => {
    render(
      <Menu.Item
        className="test-class"
        href="#hi-mom!"
        title="hi mom!"
        style={{ height: 100 }}
      >
        Title
      </Menu.Item>,
    );

    const node = screen.getByText('Title');
    expect(node.className).toMatch(/\btest-class\b/);
    expect(node.style.height).toEqual('100px');
    expect(node.getAttribute('href')).toEqual('#hi-mom!');
    expect(node.getAttribute('title')).toEqual('hi mom!');
  });

  it('Should set target attribute on anchor', () => {
    render(<Menu.Item target="_blank">Title</Menu.Item>);
    expect(screen.getByText('Title').getAttribute('target')).toEqual('_blank');
  });
});
