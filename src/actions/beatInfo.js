/* eslint-disable import/prefer-default-export */

import { HIDE_WELCOME_INFO, HIDE_LINE_TOOLTIP_INFO } from '../constants';

/* Adds a new population, newBeats is an array */
export function hideWelcomeInfo() {
  return {
    type: HIDE_WELCOME_INFO,
  };
}
/* Hides the line tooltip on generation 1 */
export function hideLineTooltip() {
  return {
    type: HIDE_LINE_TOOLTIP_INFO,
  };
}
