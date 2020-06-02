import Ux from 'ux';

export default (reference, state = {}) => {
    const {$models = {}, config = {}} = reference.props;
    state.$models = $models;
    state.$modelsAttrs = {};
    const $config = Ux.clone(config);
    {
        // 默认3列给定值
        if ($config.form) {
            if (!$config.form.hasOwnProperty('columns')) {
                $config.form.columns = 3;
            }
        }
        // 默认 window 处理
    }
    state.raft = $config;
    reference.setState(state);
}