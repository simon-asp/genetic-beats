/* eslint-disable import/prefer-default-export */
import { HIDE_WELCOME_INFO, HIDE_LINE_TOOLTIP_INFO } from '../constants';

export const beatInfoObj = {
	noOfBeats: 8,
	noOfTicks: 16,
	welcomeInfoVisible: true,
	lineTooltipHidden:false,
};

export default function beatInfo(state = beatInfoObj, action) {
	switch (action.type) {
		case HIDE_WELCOME_INFO: {
			const newState = Object.assign({}, state);
			newState.welcomeInfoVisible = false;
			return newState;
		}
		case HIDE_LINE_TOOLTIP_INFO: {
			const newState = Object.assign({}, state);
			newState.lineTooltipHidden = true;
			return newState;
		}
		case FINISH_EXPERIMENT: {
            const newState = Object.assign({}, state);
            newState.experimentFinished = true;
            return newState;            
        }
	default:
		return state;
	}
}
