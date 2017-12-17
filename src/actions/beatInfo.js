/* eslint-disable import/prefer-default-export */

import { HIDE_WELCOME_INFO } from '../constants';

/* Adds a new population, newBeats is an array */
export function hideWelcomeInfo() {
  return {
    type: HIDE_WELCOME_INFO,
  };
}
