import { ADD_NEW_POPULATION, SCORE_BEAT, UNSCORE_BEAT } from '../constants';
import getInitialPopulation from './initialPopulation';

const initialPopulation = getInitialPopulation(8);

export default function beats(state = initialPopulation, action) {
	switch (action.type) {
	case ADD_NEW_POPULATION:
		return {
			payload: 'New State',
		};
	// Map over the state, creating a new array with the score.
	case SCORE_BEAT:
		return state.map((beat, index) => {
				if (index !== action.index) {
						return beat;
				}
				return {
						...beat,
						score: action.score,
				};
		});
	case UNSCORE_BEAT:
		return state.map((beat, index) => {
				if (index !== action.index) {
						return beat;
				}
				return {
						...beat,
						score: 0,
				};
		});
	default:
		return state;
	}
}
