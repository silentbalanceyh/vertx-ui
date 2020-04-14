import Ux from 'ux';

const COLOR = "#EE7600";

export default {
    IDENTIFIER: (identifier) => {
        const state = {};
        if (identifier) {
            state.$identifier = identifier;
        }
        Ux.dgDebug(state, "Behavior 操作：IDENTIFIER", COLOR);
        return state;
    },
    QUERY: (condition = {}) => {
        const state = {};
        state.$filters = condition;
        Ux.dgDebug(state, "Behavior 操作：QUERY", COLOR);
        return state;
    },
    RECORD: (normalized = {}) => {
        const state = {};
        if (!Ux.isEmpty(normalized)) {
            state.$record = normalized;
            Ux.dgDebug(state, "Behavior 操作：RECORD", COLOR);
        }
        return state;
    },
    DIALOG: (model = {}) => {
        const state = {};
        if (!Ux.isEmpty(model)) {
            state.$dialog = model;
            Ux.dgDebug(state, "Behavior 操作：DIALOG", COLOR);
        }
        return state;
    }
}