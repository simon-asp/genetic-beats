/* eslint-disable import/prefer-default-export */

import { ADD_NEW_POPULATION, SCORE_BEAT, UNSCORE_BEAT } from '../constants';

export function getBeats() {
  return {
    type: ADD_NEW_POPULATION,
  };
}

export function scoreBeat(index, score) {
  return {
    type: SCORE_BEAT,
		score,
		index,
  };
}

export function unscoreBeat(index) {
  return {
    type: UNSCORE_BEAT,
		index,
  };
}
