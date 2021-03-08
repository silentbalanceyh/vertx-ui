import Ux from "ux";
import Ex from "ex";
import {Dsl} from 'entity';

const fnRemoveReady = (reference, keys = [], key) => {
    const data = reference.state.$data;
    /*
     * 选择的 keys 的记录处理
     */
    let relations = [];
    if (Ux.isArray(data.up) && Ux.isArray(data.down)) {
        const $keys = Ux.immutable(keys);
        /*
         * 上下互斥
         */
        if ("up" === key) {
            relations = data.up.filter(item => $keys.contains(item.key));
        } else {
            relations = data.down.filter(item => $keys.contains(item.key));
        }
    }
    return relations.map(item => item.key);
}
const fnRefresh = (reference) => (new Promise(resolve => {
    const {current = {}} = reference.props;
    const {rxRefresh} = reference.props;
    if (Ux.isFunction(rxRefresh) && current.key) {
        Ux.dgDebug({current}, "触发界面刷新！");
        rxRefresh(current.key).then(data => resolve(data));
    } else {
        resolve(current);
    }
}))

const dataTo = (current = {}, selected = {}, reference, {
    category = {}, code = {}
}) => {
    const record = {};
    /*
     * Source
     */
    record.sourceCode = current.code;
    record.sourceName = current.name;
    record.sourceGlobalId = current.globalId;
    record.sourceIdentifier = current.identifier;
    record.sourceCategory = code[current.identifier];
    /*
     * Target
     */
    record.targetCode = selected.code;
    record.targetName = selected.name;
    record.targetGlobalId = selected.globalId;
    record.targetIdentifier = category[selected['categoryThird']];
    record.targetCategory = code[record.targetIdentifier];
    record.type = Ex.onRelationType(reference, record);
    return record;
};

const dataFrom = (current = {}, selected = {}, reference, {
    category = {}, code = {}
}) => {
    const record = {};
    /*
     * Target
     */
    record.targetCode = current.code;
    record.targetName = current.name;
    record.targetGlobalId = current.globalId;
    record.targetIdentifier = current.identifier;
    record.targetCategory = code[current.identifier];
    /*
     * Source
     */
    record.sourceCode = selected.code;
    record.sourceName = selected.name;
    record.sourceGlobalId = selected.globalId;
    record.sourceIdentifier = category[selected['categoryThird']];
    record.sourceCategory = code[record.sourceIdentifier];
    record.type = Ex.onRelationType(reference, record);
    return record;
};
const fnSaveReady = (reference, key, selected = []) => {
    /*
     * current
     */
    const {current = {}, config = {}} = reference.props;
    /*
     * categoryMap = {}
     * codeMap = {}
     */
    let category = {};
    let code = {};
    const {relation = {}} = config;
    if (relation.source) {
        const categoryArray = Ux.onDatum(reference, relation.source);
        if (0 < categoryArray.length) {
            categoryArray.forEach(categoryItem => category[categoryItem.key] = categoryItem.identifier);
        }
    }
    if (relation.sourceCode) {
        const codeArray = Ux.onDatum(reference, relation.sourceCode);
        if (0 < codeArray.length) {
            codeArray.forEach(codeItem => {
                if (codeItem.code && Ux.isObject(codeItem.metadata)) {
                    const ucmdbCode = codeItem.metadata.code;
                    if (ucmdbCode) {
                        code[codeItem.code] = ucmdbCode;
                    }
                }
            })
        }
    }
    let processed = [];
    if ("up" === key) {
        /*
         * 添加上游，当前值是 target*
         */
        selected.forEach(each => {
            const result = dataFrom(current, each, reference, {
                category,
                code,
            });
            if (result) {
                processed.push(result);
            }
        });
    } else {
        /*
         * 添加下游，当前值是 source*
         */
        selected.forEach(each => {
            const result = dataTo(current, each, reference, {
                category,
                code,
            });
            if (result) {
                processed.push(result);
            }
        });
    }
    return processed;
};
export default {
    rxRemove: (reference, keys = [], key) => {
        const removedKeys = fnRemoveReady(reference, keys, key);
        if ("up" === key) {
            reference.setState({$loadingUp: true});
        } else {
            reference.setState({$loadingDown: true});
        }
        Ux.toLoading(() => Ex.I.relationDelete(removedKeys).then(data => {
            if (data) {
                const $keys = Ux.immutable(removedKeys);
                /*
                 * 从 $data 的 up 和 down 中移除数据
                 */
                let {$data = {}} = reference.state;
                $data = Ux.clone($data);
                if ("up" === key) {
                    const array = Ux.isArray($data.up) ? $data.up : [];
                    $data.up = array.filter(item => !$keys.contains(item.key));
                } else {
                    const array = Ux.isArray($data.down) ? $data.down : [];
                    $data.down = array.filter(item => !$keys.contains(item.key));
                }
                fnRefresh(reference).then(nil => reference.setState({
                    $data,
                    $selectedUp: [], $loadingUp: false,
                    $selectedDown: [], $loadingDown: false,
                }))
            }
        }))
    },
    rxSave: (reference, key) => (selected = [], ref = {}) => {
        const processed = fnSaveReady(reference, key, selected);
        /*
         * 数据全部准备好
         */
        if ("up" === key) {
            reference.setState({$loadingUp: true, $submitting: true});
        } else {
            reference.setState({$loadingDown: true, $submitting: true});
        }
        Ux.toLoading(() => Ex.I.relationSave(processed).then(data => {
            /*
             * 读取最新的 data 数据信息
             */
            let {$data = {}} = reference.state;
            $data = Ux.clone($data);
            let $dataArray;
            if ("up" === key) {
                $dataArray = Dsl.getArray(Ux.isArray($data.up) ? $data.up : []);
                data.forEach(dataItem => $dataArray.saveElement(dataItem));
                $data.up = $dataArray.to();
            } else {
                $dataArray = Dsl.getArray(Ux.isArray($data.down) ? $data.down : []);
                data.forEach(dataItem => $dataArray.saveElement(dataItem));
                $data.down = $dataArray.to();
            }
            /*
             * 内层钩子函数，用于关闭窗口（必须）
             */
            if (ref.props) {
                Ex.rx(ref).close();
            }
            fnRefresh(reference).then(nil => reference.setState({
                $data, $submitting: false,
                $selectedUp: [], $loadingUp: false,
                $selectedDown: [], $loadingDown: false,
            }))
        }).catch(error => {
            reference.setState({
                $submitting: false,
                $selectedUp: [], $loadingUp: false,
                $selectedDown: [], $loadingDown: false,
            });
            return Ux.ajaxError(reference, error);
        }));
    },
    rxQuery: (reference, key) => {
        const query = {};
        /*
         * 读取 editConfig
         */
        const {config = {}} = reference.props;
        const {editConfig = {}, relation = {}} = config;
        if (editConfig) {
            /*
             * 提取 condition 中的条件
             */
            const {condition = {}} = editConfig;
            /*
             * 提取 status 的信息
             */
            const {status = {}, ...rest} = condition;
            const criteria = {};
            criteria[""] = true;
            Object.assign(criteria, rest);
            /*
             * 状态处理
             */
            if (status.source && Ux.isArray(status.code)) {
                const $codes = Ux.immutable(status.code);
                const condStatus = Ux.onDatum(reference, status.source);
                if (0 < condStatus.length) {
                    const keys = condStatus.filter(item => $codes.contains(item.code))
                        .map(item => item.key);
                    if (0 < keys.length) {
                        criteria['status,i'] = keys;
                    }
                }
            }
            /*
             * 提取 Tab 影响的状态信息，此时不考虑 data 部分的查询条件
             * 因为只有编辑状态下才会使用这个地方的添加选择，那么编辑状态都是走的定义而不是数据本身
             */
            let source = [];
            if (relation.source) {
                source = Ux.onDatum(reference, relation.source);
                if (0 < source.length) {
                    const {$defineMap = {}} = reference.state;
                    let ids = [];
                    if ("up" === key) {
                        ids = $defineMap.up;
                    } else {
                        ids = $defineMap.down;
                    }
                    const $ids = Ux.immutable(ids);
                    /*
                     * 过滤
                     */
                    const {$selectedCategory = []} = reference.state;
                    let keys = [];
                    if (0 < $selectedCategory.length) {
                        const $category = Ux.immutable($selectedCategory);
                        keys = source.filter(cat => $ids.contains(cat.identifier))
                            .filter(cat => $category.contains(cat.identifier))
                            .map(cat => cat.key);
                    } else {
                        keys = source.filter(cat => $ids.contains(cat.identifier))
                            .map(cat => cat.key);
                    }
                    const {categoryField = []} = editConfig;
                    const subset = {};
                    categoryField.forEach(field => subset[`${field},i`] = keys);
                    subset[""] = false;
                    /*
                     * 条件描述追加
                     */
                    criteria["$0"] = subset;
                }
            }
            {
                /*
                 * key 的条件设置
                 */
                const {$data = {}} = reference.state;
                let existing = [];
                if ("up" === key) {
                    existing = $data.up.map(item => item.sourceGlobalId);
                } else {
                    existing = $data.down.map(item => item.targetGlobalId);
                }
                if (0 < existing.length) {
                    criteria[`globalId,!i`] = existing;
                }
            }
            /* 已确认条件 */
            criteria.confirmStatus = "confirmed";
            // console.info(criteria);
            query.criteria = criteria;
        }
        return query;
    },
}