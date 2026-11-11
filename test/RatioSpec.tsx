import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Ratio from '../src/Ratio';

describe('Ratio', () => {
  it('should contain `ratio-1x1` and custom class', () => {
    render(
      <Ratio data-testid="test" aspectRatio="1x1" className="custom-class">
        <div />
      </Ratio>,
    );
    const ratioElem = screen.getByTestId('test');

    expect(ratioElem.classList).toContain('custom-class');
    // Bootstrap 6 ratio utilities have no .ratio base class.
    expect(ratioElem.classList).not.toContain('ratio');
    expect(ratioElem.classList).toContain('ratio-1x1');
  });

  it('should support custom ratios using percent for aspectRatio', () => {
    render(
      <Ratio data-testid="test" aspectRatio={50}>
        <div />
      </Ratio>,
    );
    const ratioElem = screen.getByTestId('test');
    expect(ratioElem.classList).toContain('ratio-auto');
    expect(ratioElem.style.getPropertyValue('--bs-ratio')).toEqual('100 / 50');
  });

  it('should support custom ratios using fraction for aspectRatio', () => {
    render(
      <Ratio data-testid="test" aspectRatio={1 / 2}>
        <div />
      </Ratio>,
    );
    const ratioElem = screen.getByTestId('test');
    expect(ratioElem.style.getPropertyValue('--bs-ratio')).toEqual('100 / 50');
  });

  it('should support use a square ratio if aspectRatio is less than 0', () => {
    render(
      <Ratio data-testid="test" aspectRatio={-1}>
        <div />
      </Ratio>,
    );
    const ratioElem = screen.getByTestId('test');
    expect(ratioElem.style.getPropertyValue('--bs-ratio')).toEqual('1 / 1');
  });

  it('should support aspectRatio greater than 100', () => {
    render(
      <Ratio data-testid="test" aspectRatio={200}>
        <div />
      </Ratio>,
    );
    const ratioElem = screen.getByTestId('test');
    expect(ratioElem.style.getPropertyValue('--bs-ratio')).toEqual('100 / 200');
  });
  it('should stretch the embedded element to the ratio box', () => {
    render(
      <Ratio aspectRatio="16x9">
        <iframe title="embed" className="embed" />
      </Ratio>,
    );

    const iframe = screen.getByTitle('embed');
    expect(iframe.classList).toContain('embed');
    expect(iframe.classList).toContain('w-100');
    expect(iframe.classList).toContain('h-100');
  });
});
