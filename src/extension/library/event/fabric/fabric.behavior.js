import Ux from 'ux';

export default {
    IDENTIFIER: (identifier) => {
        const state = {};
        if (identifier) {
            state.$identifier = identifier;
        }
        return state;
    },
    QUERY: (condition = {}) => {
        const state = {};
        state.$filters = condition;
        return state;
    },
    RECORD: (normalized = {}) => {
        const state = {};
        if (!Ux.isEmpty(normalized)) {
            state.$record = normalized;
            return state;
        }
    }
}