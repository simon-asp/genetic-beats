import { ADD_NEW_POPULATION } from '../constants';
import getInitialPopulation from './initialPopulation';

const initialPopulation = getInitialPopulation(8);

export default function beats(state = initialPopulation, action) {
	switch (action.type) {
	case ADD_NEW_POPULATION:
		return {
			payload: 'New State',
		};
	default:
		return state;
	}
}
