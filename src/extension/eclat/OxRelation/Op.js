import Ex from 'ex';
import Ux from 'ux';

const yiRelation = (reference) => {
    const {config = {}} = reference.props;
    const {relation = {}} = config;
    const state = {};
    if (relation.definition) {
        Ex.I.relation().then(definitions => {
            state.$definition = definitions;
            state.$ready = true;
            reference.setState(state);
        })
    } else {
        state.$ready = true;
        state.$definition = false;
        reference.setState(state);
    }
};
const yoConfig = (reference, rest = {}) => {
    const config = Ux.clone(rest);
    /*
     * 设置 config.editable（配合 pluginRow）
     */
    config.editable = !Ux.pluginShield(reference);
    return config;
};
export default {
    yiRelation,
    yoConfig,
}