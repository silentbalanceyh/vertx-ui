import Ux from 'ux';
import {Dsl} from 'entity';
import dataInit from './O.fn.data.init';

export default (reference, state = {}) => {
    const {$models = {}, config = {}} = reference.props;
    state.$models = $models;
    state.$modelsAttrs = {};
    const $config = dataInit(config);
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