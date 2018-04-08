/* eslint-disable import/prefer-default-export */

import { ADD_NEW_POPULATION, ADD_NEW_POPULATION_ERROR, SCORE_BEAT, UNSCORE_BEAT, RESET_BEATS, LIKE_BEAT_TOGGLE } from '../constants';
import { database, getUserUniqueKey } from '../database';

/* Adds a new population, newBeats is an array */
export function pressGenerateButton(newBeats, timelineIndex) {
  return dispatch => {
    const userRef = database.ref('/users');
    
    // Add the new population to redux
    dispatch(addNewPopulation(newBeats));

    // Get user unique key
    const userKey = getUserUniqueKey()

    // Update database
    Promise.all([
      userRef.child(userUniqueKey).child('beats').push({
        timelineIndex: timelineIndex+1,
        ...newBeats
      }),
      userRef.child(userUniqueKey).update({
        // + 2 since it is the next one, + 1 for human readable form
        noOfGenerations: timelineIndex + 2
      })
    ])
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
export function likeBeatFirebaseAction(timelineIndex, index) {
  return dispatch => {
    
  }
}
export function unlikeBeatFirebaseAction(timelineIndex, index) {
  return dispatch => {
    
  }
}
// Increment the beatInfoShowedCount in the database
export function showBeatInfoAction() {
  return dispatch => {
    let showedCount = 0;
    
    let userKey = getUserUniqueKey()

    const userRef = database.ref('/users/'+userUniqueKey);    
    userRef.child('beatInfoShowedCount').once('value', snap => {
      if(snap.val()) showedCount = snap.val() + 1;
      else showedCount = 1;
    })
    .then(() => {
      userRef.update({
        beatInfoShowedCount: showedCount  
      })
    })
  }
}

export function resetBeats() {
  return {
    type: RESET_BEATS,
  };
}
