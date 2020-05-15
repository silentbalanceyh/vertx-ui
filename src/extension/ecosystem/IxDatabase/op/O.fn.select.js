import Ux from "ux";

export default (reference, field, config = {}) => (event) => {
    // 1.读取Input数据
    const value = Ux.ambiguityEvent(event);
    let state = Ux.xtGet(reference, field, () => value ? value : undefined);
    // 2.构造触发器
    const {trigger = {}} = config;
    const triggerValues = Ux.clone(trigger[value]);
    const values = reference.props.value;
    // 3.构造最终值
    Object.assign(triggerValues, values, state);
    Object.assign(state, triggerValues);
    state.jdbcUrl = Ux.formatExpr(state['jdbcUrl'], [
        state.hostname, state.port, state.instance
    ], true);
    Ux.fn(reference).onChange(state);
};