import dgBehavior from './behavior.@fn.dg.logging';
import Ux from 'ux';

export default (normalized = {}) => {
    const state = {};
    if (!Ux.isEmpty(normalized)) {
        state.$record = normalized;
        dgBehavior(state, "Behavior 操作：RECORD");
    }
    return state;
}