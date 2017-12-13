/* eslint-disable import/prefer-default-export */

import { ADD_NEW_POPULATION, SCORE_BEAT, UNSCORE_BEAT, RESET_BEATS } from '../constants';

/* Adds a new population, newBeats is an array */
export function addNewPopulation(newBeats) {
  return {
    type: ADD_NEW_POPULATION,
		newBeats,
  };
}

export function scoreBeat(timeLineIndex, index, score) {
  return {
    type: SCORE_BEAT,
		timeLineIndex,
		index,
		score,
  };
}

export function resetBeats() {
  return {
    type: RESET_BEATS,
  };
}
