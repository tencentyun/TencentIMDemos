import { handleActions } from 'redux-actions';
import { ADD_FOLLOWER, REDUCE_FOLLOWER, RESET_FOLLOWER, SET_FOLLOWED } from '../types/follower';

export default handleActions({
  [ADD_FOLLOWER] (state, payload) {
    return {
      ...state,
      count: state.count + 1
    }
  },
  [REDUCE_FOLLOWER] (state) {
    return {
      ...state,
      count: state.count - 1
    }
  },
  [RESET_FOLLOWER] (state, action) {
    return {
      ...state,
      count: action.payload.count || 0
    }
  },
  [SET_FOLLOWED] (state, action) {
    return {
      ...state,
      is_followed: action.payload.is_followed
    }
  }
}, {
  count: 0,
  is_followed: false
})
