import clsx from 'clsx';
import {
  breakpointPrefix,
  useBootstrapPrefix,
  useBootstrapBreakpoints,
  useBootstrapMinBreakpoint,
} from './ThemeProvider.js';
import type { ColProps, ColOrder, ColSize, NumberAttr } from './Col.js';

export interface UseColMetadata {
  as?: React.ElementType | undefined;
  bsPrefix: string;
  spans: string[];
}

export default function useCol({
  as,
  bsPrefix,
  className,
  ...props
}: ColProps): [any, UseColMetadata] {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'col');
  const breakpoints = useBootstrapBreakpoints();
  const minBreakpoint = useBootstrapMinBreakpoint();

  const spans: string[] = [];
  const classes: string[] = [];

  breakpoints.forEach((brkPoint) => {
    const propValue = props[brkPoint];
    delete props[brkPoint];

    let span: ColSize | undefined;
    let offset: NumberAttr | undefined;
    let order: ColOrder | undefined;

    if (typeof propValue === 'object' && propValue != null) {
      ({ span, offset, order } = propValue);
    } else {
      span = propValue;
    }

    const prefix = breakpointPrefix(brkPoint, minBreakpoint);

    if (span)
      spans.push(
        span === true ? `${prefix}${bsPrefix}` : `${prefix}${bsPrefix}-${span}`,
      );

    if (order != null) classes.push(`${prefix}order-${order}`);
    if (offset != null) classes.push(`${prefix}offset-${offset}`);
  });

  return [
    { ...props, className: clsx(className, ...spans, ...classes) },
    {
      as,
      bsPrefix,
      spans,
    },
  ];
}
