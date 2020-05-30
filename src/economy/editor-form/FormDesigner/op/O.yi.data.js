import Ux from 'ux';

export default (reference, state = {}) => {
    const {$models = {}, config = {}} = reference.props;
    state.$models = $models;
    state.$modelsAttrs = {};
    const $config = Ux.clone(config);
    {
        // 默认3列给定值
        if ($config.form && !$config.form.hasOwnProperty('columns')) {
            $config.form.columns = 3;
        }
    }
    state.raft = $config;
    reference.setState(state);
}