import { combineReducers } from 'redux';
import counter from './counter';
import follower from './follower';

export default combineReducers({
  counter,
  follower
});
