import dgBehavior from './behavior.@fn.dg.logging';

export default (condition = {}) => {
    const state = {};
    state.$filters = condition;
    dgBehavior(state, "Behavior 操作：QUERY");
    return state;
}