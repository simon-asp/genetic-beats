/* eslint-disable import/prefer-default-export */

import { ADD_NEW_POPULATION, SCORE_BEAT, UNSCORE_BEAT, RESET_BEATS } from '../constants';

export function addNewPopulation(newBeats) {
  return {
    type: ADD_NEW_POPULATION,
		newBeats,
  };
}

export function scoreBeat(index, score) {
  return {
    type: SCORE_BEAT,
		index,
		score,
  };
}

export function unscoreBeat(index) {
  return {
    type: UNSCORE_BEAT,
		index,
  };
}

export function resetBeats() {
  return {
    type: RESET_BEATS,
  };
}
