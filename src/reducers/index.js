import { combineReducers } from 'redux';
import runtime from './runtime';
import beats from './beats';
import beatInfo from './beatInfo';

export default combineReducers({
	runtime,
	beats,
	beatInfo,
});
