import Ux from "ux";
import U from 'underscore';

const _fillTableInfo = (target, source) => {
    target['phyTableId'] = source['id'];
    target['phyTableCode'] = source['code'];
    target['phyTableName'] = source['name'];
}

const _fillColumnInfo = (target, source) => {
    target['id'] = source['id'];
    target['code'] = source['code'];
    target['label'] = source['code'];
    target['value'] = source['code'];
    target['name'] = source['name'];
    target['status'] = source['status'];
    target['tableId'] = source['tableId'];
    target['tableCode'] = source['tableCode'];
    target['type'] = source['type'];
    target['isSelected'] = true;
}

export default {
    P1Submitting: (reference, params) => {
        const result = {};
        const user = Ux.isLogged();
        const attributes = [];
        const {$source = [], $tableNames = []} = reference.props;
        // 基础信息
        result['name'] = params['modelName'];
        result['tenantId'] = user.company;
        // const tables = Ux.onDatum(reference, 'table.names');
        const found = Ux.elementFind($tableNames, {id: params['tableName']});
        if (found[0]) {
            _fillTableInfo(result, found[0]);
        }
        // 字段信息
        if (U.isArray(params['columns']) && 0 <= params['columns'].length) {
            params['columns'].forEach(each => {
                const found = Ux.elementFind($source, {id: each});
                if (found[0]) {
                    const column = {};
                    _fillColumnInfo(column, found[0])
                    attributes.push(column);
                }
            })
        }
        result['attributes'] = attributes;
        return result;
    },
    P2Submitting: (reference, params) => {
        const result = {};
        const user = Ux.isLogged();
        const attributes = [];
        const {$target = [], $tableNames = []} = reference.props;
        const {relations = []} = params;
        if (relations.length > 0) {
            // 反复增加时，每次提交最后一个元素
            const relation = relations[relations.length - 1];
            // 基础信息
            result['name'] = relation['modelName'];
            result['tenantId'] = user.company;
            result['relationshipType'] = "1";
            result['objectType'] = "4";
            const found = Ux.elementFind($tableNames, {id: relation['tableName']});
            if (found[0]) {
                _fillTableInfo(result, found[0]);
            }
            // 字段信息
            if (U.isArray(relation['columnsRel']) && 0 <= relation['columnsRel'].length) {
                relation['columnsRel'].forEach(each => {
                    const found = Ux.elementFind($target, {id: each});
                    if (found[0]) {
                        const column = {};
                        _fillColumnInfo(column, found[0])
                        attributes.push(column);
                    }
                })
            }
            result['attributes'] = attributes;
        }
        return result;
    },
    P3Submitting: (reference, params) => {
        const result = {};
        const user = Ux.isLogged();
        const attributes = [];
        const {$target = [], $tableNames = []} = reference.props;
        const {actions = []} = params;
        if (actions.length > 0) {
            // 反复增加时，每次提交最后一个元素
            const action = actions[actions.length - 1];
            // 基础信息
            result['name'] = action['modelName'];
            result['tenantId'] = user.company;
            result['relationshipType'] = "1";
            result['objectType'] = "2";
            const found = Ux.elementFind($tableNames, {id: action['tableName']});
            if (found[0]) {
                _fillTableInfo(result, found[0]);
            }
            result['accountMetaObjectId'] = action['modelId'];
            result['mainTimeColumnId'] = action['modelAct'];
            // 字段信息
            if (U.isArray(action['columnsRel']) && 0 <= action['columnsRel'].length) {
                action['columnsRel'].forEach(each => {
                    const found = Ux.elementFind($target, {id: each});
                    if (found[0]) {
                        const column = {};
                        _fillColumnInfo(column, found[0])
                        attributes.push(column);
                    }
                })
            }
            result['attributes'] = attributes;
        }
        return result;

    }
}