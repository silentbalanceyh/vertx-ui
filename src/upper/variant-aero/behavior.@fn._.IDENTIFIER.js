import dgBehavior from './behavior.@fn.dg.logging';

export default (identifier) => {
    const state = {};
    if (identifier) {
        state.$identifier = identifier;
    }
    dgBehavior(state, "Behavior 操作：IDENTIFIER");
    return state;
}