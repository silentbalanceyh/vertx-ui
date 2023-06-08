import {createReducer} from 'redux-act'

import state from './state'
import types from './actions'

export default createReducer({
    [types.fnFlush]: (state, inState = {}) => {
        if (inState.to) {
            return {...inState.to(state)}
        } else {
            console.warn("[Env] 状态无改变: inState = ", inState);
            return state
        }
    }
}, state)
