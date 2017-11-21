import { combineReducers } from 'redux';
import runtime from './runtime';
import beats from './beats';

export default combineReducers({
	runtime,
	beats,
});
