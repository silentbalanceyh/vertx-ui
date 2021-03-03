import {Of} from "app";
import {Dsl} from 'entity';
import Ux from "ux";

const yiPage = (reference) => {
    const state = {};
    const request = {};
    const user = Ux.isLogged();
    request.tenantId = user.company;
    request.rows = 10000;
    Dsl.of(reference).bind(Of.apiTableGet).ok(response => {
        state.$tableNames = response.rows;
        // 步骤
        state.$step = 0;
        state.$stepSub = 0;
        state.$ready = true;
        reference.setState(state);
    }).async(request);
}
const yiStep1 = (reference) => {
    const state = {};
    state.$ready = true;
    const {$data = {}} = reference.props;
    state.$data = $data;
    reference.setState(state);
}
const yiStep2 = (reference) => {
    const state = {};
    state.$ready = true;
    reference.setState(state);
}
const yiStep3 = (reference) => {
    const state = {};
    state.$ready = true;
    reference.setState(state);
}

const toTreeItem = (input = {}) => {
    const model = {};
    model.key = input.modelName;
    model.name = input.modelName;
    model.text = input.modelName;
    model.tableName = input.tableName;
    model.modelName = input.modelName;
    model.type = "MODEL";
    return model;
}
const yiStep4 = (reference) => {
    const state = {};
    state.$ready = true;
    const {data = {}} = reference.props;
    const $sources = [];
    // 顶层数据
    const model = toTreeItem(data);
    $sources.push(model);
    // 行为和属性
    const {relations = [], actions = []} = data;
    relations.forEach(relation => {
        const item = toTreeItem(relation);
        item.parentId = model.key;
        item.type = "RELATION";
        $sources.push(item);
    });
    actions.forEach(action => {
        const item = toTreeItem(action);
        item.parentId = model.key;
        item.type = "ACTION";
        $sources.push(item);
    });
    state.$sources = $sources;
    reference.setState(state);
}
export default {
    yiPage,
    yiStep1,
    yiStep2,
    yiStep3,
    yiStep4,
}