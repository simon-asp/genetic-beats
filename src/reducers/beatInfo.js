/* eslint-disable import/prefer-default-export */
import { HIDE_WELCOME_INFO } from '../constants';

export const beatInfoObj = {
	noOfBeats: 8,
	noOfTicks: 16,
	welcomeInfoVisible: true,
};

export default function beatInfo(state = beatInfoObj, action) {
	switch (action.type) {
		case HIDE_WELCOME_INFO: {
			const newState = Object.assign({}, state);
			newState.welcomeInfoVisible = false;
			return newState;
		}
	default:
		return state;
	}
}
