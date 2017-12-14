import { ADD_NEW_EVOLUTION_PAIRS, RESET_EVOLUTION_PAIRS } from '../constants';

/* Reducer of the selected pairs for each generation made during the genetic algorithm */
export default function evolutionPairs(state = [], action) {
	switch (action.type) {
	case ADD_NEW_EVOLUTION_PAIRS: {
		const newState = state.slice();
		newState.push(action.selectedPairs);
		return newState;
	}
	case RESET_EVOLUTION_PAIRS:
		return [];
	default:
		return state;
	}
}
