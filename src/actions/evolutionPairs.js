/* eslint-disable import/prefer-default-export */

import { ADD_NEW_EVOLUTION_PAIRS, RESET_EVOLUTION_PAIRS } from '../constants';

/* Adds a new selected pair from the selection algorithm of the GA */
export function addNewSelectedPairs(selectedPairs, timelineIndex) {
  return {
    type: ADD_NEW_EVOLUTION_PAIRS,
		selectedPairs,
		timelineIndex,
  };
}

export function resetSelectedPairs() {
  return {
    type: RESET_EVOLUTION_PAIRS,
  };
}
