import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import beats from './beats';

export default combineReducers({
	user,
	runtime,
	beats,
});
