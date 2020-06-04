import Ux from 'ux';
import {Dsl} from 'entity';

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
    }
    {
        const fields = [];
        const {attributes = []} = $models;
        attributes.forEach(attribute => {
            const item = {};
            item.key = attribute.name;
            item.display = attribute.alias;
            item.data = Ux.clone(attribute);
            fields.push(item);
        });
        // ASSIST: 字段列表
        state.$a_model_fields = Dsl.getArray(fields);
    }
    state.raft = $config;
    reference.setState(state);
}