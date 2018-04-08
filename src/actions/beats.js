/* eslint-disable import/prefer-default-export */

import { ADD_NEW_POPULATION, ADD_NEW_POPULATION_ERROR, SCORE_BEAT, UNSCORE_BEAT, RESET_BEATS, LIKE_BEAT_TOGGLE } from '../constants';
import database from '../database';

/* Adds a new population, newBeats is an array */
export function pressGenerateButton(newBeats, timelineIndex) {
  return dispatch => {
    dispatch(addNewPopulation(newBeats));
    const userRef = database.ref('/users');
    userRef.child('1').child('beats').push({
      timelineIndex,
      ...newBeats
    })
    .catch((error) => {
      console.log(error)
      dispatch(addNewPopulationError());
    });
  }
}
export function addNewPopulationError() {
  return {
    type: ADD_NEW_POPULATION_ERROR
  }
}
export function addNewPopulation(newBeats) {
  return {
    type: ADD_NEW_POPULATION,
		newBeats,
  };
}

export function scoreBeat(timelineIndex, index, score) {
  return {
    type: SCORE_BEAT,
		timelineIndex,
		index,
		score,
  };
}

export function likeBeatToggle(timelineIndex, index) {
  return {
    type: LIKE_BEAT_TOGGLE,
		timelineIndex,
		index,
  };
}

export function resetBeats() {
  return {
    type: RESET_BEATS,
  };
}
