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
        /*
         * 上下互斥
         */
        if ("up" === key) {
            relations = data.up.filter(item => keys.includes(item.key));
        } else {
            relations = data.down.filter(item => keys.includes(item.key));
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
        let of = Ux.of(reference);
        if ("up" === key) {
            of = of.in({$loadingUp: true});
            // reference.?etState({$loadingUp: true});
        } else {
            of = of.in({$loadingDown: true});
            // reference.?etState({$loadingDown: true});
        }
        of.handle(() => Ex.I.relationDelete(removedKeys).then(data => {
            if (data) {
                /*
                 * 从 $data 的 up 和 down 中移除数据
                 */
                let {$data = {}} = reference.state;
                $data = Ux.clone($data);
                if ("up" === key) {
                    const array = Ux.isArray($data.up) ? $data.up : [];
                    $data.up = array.filter(item => !removedKeys.includes(item.key));
                } else {
                    const array = Ux.isArray($data.down) ? $data.down : [];
                    $data.down = array.filter(item => !removedKeys.includes(item.key));
                }
                fnRefresh(reference).then(nil => {
                    Ux.of(reference).in({
                        $data,
                        $selectedUp: [], $loadingUp: false,
                        $selectedDown: [], $loadingDown: false,
                    }).done();
                })
            }
        }), 0)
        // Ux.toLoading(() => Ex.I.relationDelete(removedKeys).then(data => {
        //     if (data) {
        //         let {$data = {}} = reference.state;
        //         $data = Ux.clone($data);
        //         if ("up" === key) {
        //             const array = Ux.isArray($data.up) ? $data.up : [];
        //             $data.up = array.filter(item => !removedKeys.includes(item.key));
        //         } else {
        //             const array = Ux.isArray($data.down) ? $data.down : [];
        //             $data.down = array.filter(item => !removedKeys.includes(item.key));
        //         }
        //         fnRefresh(reference).then(nil => reference.?etState({
        //             $data,
        //             $selectedUp: [], $loadingUp: false,
        //             $selectedDown: [], $loadingDown: false,
        //         }))
        //     }
        // }))
    },
    rxSave: (reference, key) => (selected = [], ref = {}) => {
        const processed = fnSaveReady(reference, key, selected);
        /*
         * 数据全部准备好
         */
        let of = Ux.of(reference);
        if ("up" === key) {
            of = of.in({$loadingUp: true}).submitting();
            // reference.?etState({$loadingUp: true, $submitting: true});
        } else {
            of = of.in({$loadingDown: true}).submitting();
            // reference.?etState({$loadingDown: true, $submitting: true});
        }
        of.handle(() => Ex.I.relationSave(processed).then(data => {
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
                Ux.of(ref)._.close();
            }
            fnRefresh(reference).then(nil => {
                Ux.of(reference).in({
                    $data,
                    $selectedUp: [], $loadingUp: false,
                    $selectedDown: [], $loadingDown: false,
                }).submitted().done();
                // reference.?etState({
                //     $data, $submitting: false,
                //     $selectedUp: [], $loadingUp: false,
                //     $selectedDown: [], $loadingDown: false,
                // })
            })
        }).catch(error => {
            return Ux.of(reference).in({
                $selectedUp: [], $loadingUp: false,
                $selectedDown: [], $loadingDown: false,
            }).submitted().future(() => Ux.ajaxError(reference, error));
            // reference.?etState({
            //     $submitting: false,
            //     $selectedUp: [], $loadingUp: false,
            //     $selectedDown: [], $loadingDown: false,
            // });
            //  return Ux.ajaxError(reference, error);
        }), 0);
        // Ux.toLoading(() => Ex.I.relationSave(processed).then(data => {
        //     /*
        //      * 读取最新的 data 数据信息
        //      */
        //     let {$data = {}} = reference.state;
        //     $data = Ux.clone($data);
        //     let $dataArray;
        //     if ("up" === key) {
        //         $dataArray = Dsl.getArray(Ux.isArray($data.up) ? $data.up : []);
        //         data.forEach(dataItem => $dataArray.saveElement(dataItem));
        //         $data.up = $dataArray.to();
        //     } else {
        //         $dataArray = Dsl.getArray(Ux.isArray($data.down) ? $data.down : []);
        //         data.forEach(dataItem => $dataArray.saveElement(dataItem));
        //         $data.down = $dataArray.to();
        //     }
        //     /*
        //      * 内层钩子函数，用于关闭窗口（必须）
        //      */
        //     if (ref.props) {
        //         Ex.?x(ref).close();
        //     }
        //     fnRefresh(reference).then(nil => reference.?etState({
        //         $data, $submitting: false,
        //         $selectedUp: [], $loadingUp: false,
        //         $selectedDown: [], $loadingDown: false,
        //     }))
        // }).catch(error => {
        //     reference.?etState({
        //         $submitting: false,
        //         $selectedUp: [], $loadingUp: false,
        //         $selectedDown: [], $loadingDown: false,
        //     });
        //     return Ux.ajaxError(reference, error);
        // }));
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
                const $codes = status.code;
                const condStatus = Ux.onDatum(reference, status.source);
                if (0 < condStatus.length) {
                    const keys = condStatus.filter(item => $codes.includes(item.code))
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
                    /*
                     * 过滤
                     */
                    const {$selectedCategory = []} = reference.state;
                    let keys = [];
                    if (0 < $selectedCategory.length) {
                        keys = source.filter(cat => ids.includes(cat.identifier))
                            .filter(cat => $selectedCategory.includes(cat.identifier))
                            .map(cat => cat.key);
                    } else {
                        keys = source.filter(cat => ids.includes(cat.identifier))
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