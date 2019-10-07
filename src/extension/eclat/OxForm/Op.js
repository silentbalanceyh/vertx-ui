import Ex from 'ex';

const yiForm = (reference) => {
    const state = {};
    const {config = {}} = reference.props;
    const {event = {}} = config;
    const $op = {};
    Object.keys(event)
        .forEach(opKey => $op[opKey] = Ex.onOp(reference, event[opKey]));
    state.$op = $op;
    state.$ready = true;
    /*
     * initial 初始值解析专用（OxForm才有，ExForm无）
     */
    reference.setState(state);
};

export default {
    yiForm,
};