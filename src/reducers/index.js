import { combineReducers } from 'redux';
import runtime from './runtime';
import beatTimeline from './beatTimeline';
import beatInfo from './beatInfo';
import evolutionPairs from './evolutionPairs';

export default combineReducers({
	runtime,
	beatTimeline,
	beatInfo,
	evolutionPairs,
});
