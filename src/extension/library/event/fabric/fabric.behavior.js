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
    }
}