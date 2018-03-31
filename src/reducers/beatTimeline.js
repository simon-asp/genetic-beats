import { ADD_NEW_POPULATION, SCORE_BEAT, RESET_BEATS, LIKE_BEAT_TOGGLE } from '../constants';
import getInitialPopulation from './initialPopulation';

const initialPopulation = getInitialPopulation();

export default function beatTimeline(state = initialPopulation, action) {
	switch (action.type) {
	case ADD_NEW_POPULATION:
		return [
        ...state,
		action.newBeats,
      ];
	// Map over the state, creating a new array with the score.
	case SCORE_BEAT: {
		const newState = state.slice();
		newState[action.timelineIndex][action.index].score = action.score;
		return newState;
	}
	case LIKE_BEAT_TOGGLE: {
		const newState = state.slice();
		const prevLiked = state[action.timelineIndex][action.index].liked;
		console.log(!prevLiked)
		newState[action.timelineIndex][action.index].liked = !prevLiked;
		return newState;
	}
	case RESET_BEATS:
		return initialPopulation;
	default:
		return state;
	}
}
