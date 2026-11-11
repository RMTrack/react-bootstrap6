import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Breadcrumb from '../src/Breadcrumb';

describe('<Breadcrumb>', () => {
  it('Should apply id to the wrapper ol element', () => {
    const { container } = render(<Breadcrumb id="custom-id" />);

    expect(container.querySelectorAll('#custom-id').length).toEqual(1);
  });

  it('Should have breadcrumb class inside ol', () => {
    render(<Breadcrumb />);

    expect(screen.getByRole('list').classList).toContain('breadcrumb');
  });

  it('Should have custom classes', () => {
    render(<Breadcrumb className="custom-one custom-two" data-testid="test" />);

    const breadcrumb = screen.getByTestId('test');
    expect(breadcrumb.classList).toContain('custom-one');
    expect(breadcrumb.classList).toContain('custom-two');
  });

  it('Should not have a navigation role', () => {
    const { container } = render(
      <Breadcrumb className="custom-one custom-two" />,
    );

    expect(container.querySelectorAll('ol[role="navigation"]').length).toEqual(
      0,
    );
  });

  it('Should have an aria-label in ol', () => {
    render(<Breadcrumb className="custom-one custom-two" />);
    expect(screen.getByLabelText('breadcrumb')).toBeTruthy();
  });

  it('Should have nav as default component', () => {
    render(<Breadcrumb data-testid="test" />);

    expect(screen.getByTestId('test').tagName).toEqual('NAV');
  });
  it('Should render .breadcrumb-divider items between the items', () => {
    render(
      <Breadcrumb data-testid="test">
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Library</Breadcrumb.Item>
        <Breadcrumb.Item active>Data</Breadcrumb.Item>
      </Breadcrumb>,
    );

    const list = screen.getByTestId('test').querySelector('ol')!;
    expect(Array.from(list.children).map((li) => li.className)).toEqual([
      'breadcrumb-item',
      'breadcrumb-divider',
      'breadcrumb-item',
      'breadcrumb-divider',
      'breadcrumb-item',
    ]);
    const divider = list.children[1];
    expect(divider.getAttribute('aria-hidden')).toEqual('true');
    expect(divider.textContent).toEqual('');
  });

  it('Should render custom divider content', () => {
    render(
      <Breadcrumb data-testid="test" divider="/">
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Data</Breadcrumb.Item>
      </Breadcrumb>,
    );

    expect(
      screen.getByTestId('test').querySelector('.breadcrumb-divider')!
        .textContent,
    ).toEqual('/');
  });

  it('Should not render a divider for a single item', () => {
    render(
      <Breadcrumb data-testid="test">
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>,
    );

    expect(
      screen.getByTestId('test').querySelector('.breadcrumb-divider'),
    ).toBeNull();
  });
});
