import dgBehavior from './behavior.@fn.dg.logging';
import Ux from 'ux';

export default (model = {}) => {
    const state = {};
    if (!Ux.isEmpty(model)) {
        state.$dialog = model;
        dgBehavior(state, "Behavior 操作：DIALOG");
    }
    return state;
}