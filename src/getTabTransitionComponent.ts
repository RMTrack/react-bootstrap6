import { TransitionComponent } from '@restart/ui/types';
import { createCssTransition } from './CssTransition.js';
import type { TransitionType } from './helpers.js';

// Bootstrap 6 tab panes fade in through CSS (`@starting-style`) as soon as
// they get `.active`, and the pane being left hides at once. The transition
// only waits for the CSS animation so the callbacks fire at the right time.
export const TabPaneTransition = createCssTransition('TabPaneTransition', {});

// `.tab-pane-instant` skips the CSS animation.
const InstantTabPaneTransition = createCssTransition(
  'InstantTabPaneTransition',
  {
    entering: 'tab-pane-instant',
    entered: 'tab-pane-instant',
    exiting: 'tab-pane-instant',
    exited: 'tab-pane-instant',
  },
);

export default function getTabTransitionComponent(
  transition?: TransitionType,
): TransitionComponent | undefined {
  if (typeof transition === 'boolean') {
    return transition ? TabPaneTransition : InstantTabPaneTransition;
  }

  return transition;
}
