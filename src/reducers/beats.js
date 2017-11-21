import { ADD_NEW_POPULATION, SCORE_BEAT } from '../constants';
import getInitialPopulation from './initialPopulation';

const initialPopulation = getInitialPopulation(8);

export default function beats(state = initialPopulation, action) {
	switch (action.type) {
	case ADD_NEW_POPULATION:
		return {
			payload: 'New State',
		};
	case SCORE_BEAT:
		return state.map((beat, index) => {
				if (index !== action.index) {
						// This isn't the item we care about - keep it as-is
						return beat;
				}

				// Otherwise, this is the one we want - return an updated value
				return {
						...beat,
						score: action.score,
				};
		});
	default:
		return state;
	}
}
