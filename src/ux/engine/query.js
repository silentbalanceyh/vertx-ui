import Abs from '../abyss';
import Dev from '../develop';

import Pr from './parser';
import Fn from './functions';
import {Dsl} from 'entity';

const analyzeBool = (value) => {
    if (value) {
        if (Abs.isArray(value)) {
            return value
                .filter(item => "string" === typeof item)
                // eslint-disable-next-line
                .map(item => analyzeBool(item))
        } else {
            if ("true" === value) {
                return true;
            } else if ("false" === value) {
                return false;
            } else {
                /*
                 * 返回该值本身
                 */
                return value;
            }
        }
    }
};
const analyzePair = (condition = {}, field, value) => {
    if (value) {
        if (Abs.isArray(value)) {
            if (0 === value.length) {
                condition[field] = "__DELETE__";
            } else {
                condition[field] = value;
            }
        } else {
            condition[field] = value;
        }
    } else {
        if (undefined === value) {
            condition[field] = "__DELETE__";
        }
    }
};
// common
const finalize = (params = {}) => {
    /*
     * 计算最终的 $filters
     */
    const $filters = Abs.clone(params);
    /*
     * 如果只有 "" 和 其他键值
     */
    if (Object.keys($filters).length <= 2) {
        if ($filters.hasOwnProperty("")) {
            delete $filters[""];
        }
    }
    return $filters;
};
/*
 * 过滤来源的操作点有几个：
 * 1. 列过滤修改 $condition
 *    - SEARCH：搜索框
 *    - DIRECT：下拉筛选
 *    - 这种不反向修改 搜索框 和 高级搜索框
 * 2. 基础搜索修改 $condition
 *    - 若存在于列过滤中，则需要同步设值
 *    - 若存在于表单中（高级），则需要同步设值
 * 3. 高级搜索修改 $condition
 *    - 若存在于列过滤中，则需要同步设值
 *    - 若存在于基础搜索中，则需要同步设值
 */
const _inNorm = (field, filterType = {}) => {
    let normalized = {};
    if (filterType.hasOwnProperty(field)) {
        const config = filterType[field];
        const type = config.type;
        if ("SEARCH" === type) {
            normalized.field = `${field},c`;
            normalized.type = Symbol.for("INNER-SEARCH");
            normalized.isArray = false;
        } else {
            normalized.field = `${field},i`;
            normalized.type = Symbol.for("INNER-DIRECT");
            normalized.isArray = true;
        }
        /*
         * STRING
         * BOOLEAN
         * NUMBER
         */
        normalized.dataType = config.dataType;
    } else {
        // 条件不存在于列过滤中
        if (0 < field.indexOf(',')) {
            // 本身带有操作符
            normalized.field = field;
        } else {
            // 本身不带操作符，默认使用 Contains 条件
            normalized.field = `${field},c`;
        }
        normalized.isArray = false;
        normalized.type = Symbol.for("OUTER");  // 外层组件传入
    }
    return normalized;
};
/*
 * __NONE__：什么也不做
 * STRING：维持原样：Ant Design中本身就是如此
 * BOOLEAN 和 NUMBER：需要转换
 */
const _inActualValue = (term = {}, value = []) => {
    const dataType = term.dataType;
    if ("BOOLEAN" === dataType) {
        return Abs.clone(value).map(item => {
            if ("false" === item) {
                return false;
            } else {
                return Boolean(item);
            }
        });
    } else if ("NUMBER" === dataType) {
        return Abs.clone(value).map(item => Number(item));
    } else {
        return value;
    }
};
/*
 * 必须按顺序执行，term 的结构很重要
 */
const _inNormValue = (term = {}, value) => {
    if (Symbol.for("OUTER") === term.type) {
        // 外置过滤，直接追加即可
        term.value = value;
    } else {
        /*
         * 列过滤模式，value 必须是 [] 格式
         * 和 Ant Design 中的列过滤对应的值相关
         */
        if (Abs.isArray(value)) {
            // 删除 / 保存
            if (0 === value.length) {
                // in的特殊处理，不选择的时候直接删除该条件
                term.value = "__DELETE__";
            } else {
                if (Symbol.for("INNER-SEARCH") === term.type) {
                    /*
                     * 必定是 STRING，直接进行值格式化
                     */
                    term.value = value[0];
                } else {
                    term.value = _inActualValue(term, value);
                }
            }
        }
    }
};
const _inNormalizer = (condition = {}, {
    filterType = {}, // 列过滤专用配置，对应到 $terms 变量中
}) => {
    // 原始查询条件，一旦执行就会存入
    const normalized = {};
    Abs.itObject(condition, (field, value) => {
        // 条件字段处理
        const term = _inNorm(field, filterType);
        // 针对处理后的最终值
        _inNormValue(term, value);
        // 条件处理
        normalized[term.field] = term.value;
    });
    if (1 < Object.keys(normalized).length) {
        normalized[""] = true;
    }
    return normalized;
};

const aiSearchInput = (field, value = {}, condition = {}) => {
    let fieldNorm = "";
    if (!Abs.isEmpty(value)) {
        fieldNorm = field + "," + value.op;
    } else {
        fieldNorm = field + ",c";
    }
    const text = value.text ? value.text : "";
    analyzePair(condition, fieldNorm, text);
}
const aiSearchRangeDate = (field, value = {}, condition = {}) => {
    /*
     * 范围查询
     */
    if (value.start && value.end) {
        const complex = {};
        complex[""] = true;
        const startField = field + ",>";
        complex[startField] = value.start.toISOString();
        const endField = field + ",<";
        complex[endField] = value.end.toISOString();
        analyzePair(condition, "$" + field, complex);
    } else if (value.start) {
        /*
         * 只有开始时间，查询大于这个时间的
         */
        const fieldNorm = field + ",>";
        const fieldValue = value.start.toISOString();
        analyzePair(condition, fieldNorm, fieldValue);
    } else if (value.end) {
        /*
         * 只有结束时间，查询小于这个时间的
         */
        const fieldNorm = field + ",<";
        const fieldValue = value.end.toISOString();
        analyzePair(condition, fieldNorm, fieldValue);
    }
}
// 字段级别执行
const FieldRender = {
    aiSearchInput,
    aiSearchRangeDate
}
/**
 * ## 「标准」`Ux.qrForm`
 *
 * 针对查询专用表单的条件数据收集处理，构造查询$filters变量专用，收集表单中的条件数据构造查询条件信息，
 *
 * 1. connector有两个值：`AND | OR`，用于设置条件和条件之间的条件连接符。
 * 2. 如果条件中遇到值：`__DELETE__`的值，则将该条件删除掉。
 * 3. 系统会搜索同名属性，和`op`组合成最新条件，完成搜索表单的提交操作。
 *
 * > 最终生成的查询条件可在日志中查看。
 *
 * @memberOf module:_qr
 * @method qrForm
 * @param {Object} input 输入的字段信息。
 * @param {String} connector 查询条件。
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Object} 返回最终查询条件，写入$filters变量。
 */
const qrForm = (input, connector = "AND", reference) => {
    const condition = {};
    condition[""] = ("AND" === connector);
    /*
     * 条件专用
     */
    const {raft = {}} = reference.state ? reference.state : {};
    const {search = {}} = raft;
    Abs.itObject(input, (field, value) => {
        if (search.hasOwnProperty(field)) {
            const executor = FieldRender[search[field]];
            if (Abs.isFunction(executor)) {
                executor(field, value, condition, reference);
            } else {
                analyzePair(condition, field, value);
            }
        } else {
            analyzePair(condition, field, value);
        }
    });
    const query = finalize(condition);
    Dev.dgDebug({
        search, query
    }, "[ Qr ] 触发搜索", "#436EEE");
    return query;
};

/**
 * ## 「标准」`Ux.qrTerms`
 *
 * 收集列中的`$filter`过滤配置数据，生成最终的 $terms 变量。
 *
 * @memberOf module:_qr
 * @param {Array} columns 列过滤中的所有列配置数据
 * @returns {Object} 返回列配置构造的数据
 */
const qrTerms = (columns = []) => {
    /*
     * 在列确认之后，执行 $terms 变量的注入
     * $terms 记录了列变更的类型，用于后续的列变更专用处理
     */
    let $terms = {};
    if (Abs.isArray(columns)) {
        /*
         * 1）列定义中包含了当前字段（ dataIndex = field ）
         * 2）列定义中包含了 $filter 字段
         * 3）直接读取 $filter 中的 type 类型
         * 4）$filter 中的 type 值默认：INNER-DIRECT
         */
        columns.forEach(column => {
            const field = column.dataIndex;
            const filter = column['$filter'];
            if (filter) {
                $terms[field] = {};
                $terms[field].type = filter.type ? filter.type : "DIRECT";
                const {config = {}} = filter;
                if (config.dataType) {
                    $terms[field].dataType = config.dataType;
                } else {
                    /*
                     * 默认的搜索模式
                     */
                    $terms[field].dataType = "STRING";
                }
            }
        });
    }
    Object.freeze($terms);
    return $terms;
};
/**
 * ## 「标准」`Ux.qrClear`
 *
 * 列筛选专用的清除筛选条件专用API，该API会执行如下操作：
 *
 * 1. 将传入的`state`作为基础数据传入，一般会传入reference.state的计算状态。
 * 2. 清空这个对象中的`$condition`字段设置成空对象。
 * 3. 保留`$terms`字段，并触发列筛选过程中的同步（保存列查询定义）。
 *
 * 框架中的应用代码：
 *
 * ```js
 * Ux.prevent(event);
 * const {$condition = {}} = reference.state;
 *
 * // 条件不存在的时候清空条件数据，此时state传入为空
 * if (0 < Object.keys($condition).length) {
 *      Ux.qrClear(reference);
 * }
 * ```
 *
 * @memberOf module:_qr
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} state 状态数据
 */
const qrClear = (reference = {}, state = {}) => {
    let append = state ? state : {};
    Object.assign(append, {$condition: {}});
    reference.setState(append);

    const {$terms = {}} = reference.state ? reference.state : {};
    Fn.activeColumn($terms);
};


/**
 * ## 「标准」`Ux.qrInput`
 *
 * 单独输入框的搜索条件构造专用函数，如果清除则值设为`__DELETE__`。
 *
 * @memberOf module:_qr
 * @param {Array} cond 查询条件字段信息。
 * @param {any} value 值信息，如果无值则清除条件。
 */
const qrInput = (cond = [], value) => {
    const condition = {};
    if (value) {
        cond.forEach(field => condition[field] = value);
    } else {
        cond.forEach(field => condition[field] = "__DELETE__");
    }
    condition[""] = false;
    return finalize(condition);
};


/**
 *
 * ## 「标准」`Ux.qrCombine`
 *
 * 查询引擎专用的合并函数，深度计算，内部使用了`QQuery`对象。
 *
 * 1. 以`query`参数为基础查询引擎数据，构造模式`(query,reference)`。
 * 2. 两个参数构造`QQuery`对象，然后将condition用AND方式追加到查询条件中。
 *
 * > 注，最终条件会移除掉`__DELETE__`值的条件。
 *
 * @memberOf module:_qr
 * @method qrCombine
 * @param {Object} query 查询条件。
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String[]} condition 查询条件处理。
 * @returns {any} 返回最终的 query 结构。
 */
const qrCombine = (query = {}, reference, ...condition) => {
    /*
     * 查询条件初始化
     */
    const queryRef = Dsl.getQuery(query, reference);
    /*
     * 条件过滤
     */
    if (condition) {
        condition.filter(Abs.isObject).forEach(item => queryRef.and(item));
    }
    /*
     * 返回合并结果
     */
    return queryRef.to();
}

/**
 * ## 「标准」`Ux.qrCommon`
 *
 * 复杂内容核心操作，用于设置默认的 $query 信息
 *
 * ### 优先级选取
 *
 * 1. props 中的 $query 优先
 * 2. config 中的 query 第一级，直接合并 config.query （全合并）
 * 3. config 中的 ajax.magic 合并（需解析，只合并 criteria）
 *
 *
 * @memberOf module:_qr
 * @method qrCommon
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} config 查询配置
 * @returns {Object} 返回最终的 query 结构。
 */
const qrCommon = (reference, config) => {
    if (config) {
        const {$query = {}} = reference.props;
        let defaultQuery = qrCombine($query, reference);
        if (Abs.isObject(config.query)) {
            /*
             * pager 设置
             */
            const pager = config.query.pager;
            if (pager && Abs.isObject(pager)) {
                defaultQuery.pager = Abs.clone(pager);
            }
            /*
             * projection 设置
             */
            const projection = config.query.projection;
            if (Abs.isArray(projection)) {
                defaultQuery.projection = Abs.clone(projection);
            }
            /*
             * sorter 设置
             */
            const sorter = config.query.sorter;
            if (Abs.isArray(sorter)) {
                defaultQuery.sorter = Abs.clone(sorter);
            }
            /*
             * 合并查询条件
             */
            const criteria = config.query.criteria;
            defaultQuery = qrCombine(defaultQuery, reference, criteria);
        }
        /*
         * 针对 ajax 专用的 magic 处理
         */
        const {ajax = {}} = config;
        if (ajax.magic) {
            const criteria = Pr.parseInput(ajax.magic, reference);
            if (!Abs.isEmpty(criteria)) {
                defaultQuery = qrCombine(defaultQuery, reference, criteria);
            }
        }
        Dev.dgDebug(defaultQuery.criteria, "[ Ux ] 默认的查询条件：", "#8E8E38");
        return defaultQuery;
    } else {
        /*
         * 不传入 config，则直接从 reference 中处理
         */
        const {$query = {}} = reference.state ? reference.state : {};
        Dev.dgDebug($query.criteria, "[ Ux ] state 状态中的查询条件：", "#8E8E38");
        return Abs.clone($query);
    }
}

/**
 * ## 「标准」`Ux.qrComplex`
 *
 * 复杂模式的处理流程，三合一的查询条件处理，处理不同情况的查询条件，执行合并。
 *
 * 1. `$condition`：当前环境的基础条件，该基础条件受`列过滤`的影响，触发了列过滤后该变量会受到影响。
 * 2. `$terms`：该变量是计算基础，保存了列中定义了`filter`的列配置，换算过后的定义结果会保存在 $terms 变量中。
 * 3. `$filters`：该变量保存的是高级搜索表单存储的最终查询条件。
 *
 * 需要说明查询条件来自于几个源头：
 *
 * 1. props属性中的$query条件，同时包含config配置中的条件，最终计算存储在state中，生成$query新变量（状态中）。
 * 2. 如果是列过滤功能，则直接修改$condition变量的值。
 * 3. 如果是基础搜索和高级搜索，则直接修改$filters变量的值。
 *
 * > 所以最终查询条件的计算是：reference.state中的`$query + $condition + $filters`三者合一，借用`QQuery`实现查询条件的复杂运算。
 *
 * @memberOf module:_qr
 * @method qrComplex
 * @param {Object} query 查询条件专用结构。
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Object} 返回最终的 query 结构。
 */
const qrComplex = (query = {}, reference) => {
    const {
        $condition = {},    // 基础条件
        $terms = {},        // 带有 $filter 的 column 部分的
        $filters = {},      // 基础表单专用查询条件
    } = reference.state ? reference.state : {};
    /*
     * 查询条件合并，直接在 query 中合并 criteria 节点的查询条件
     */
    const queryRef = Dsl.getQuery(query, reference);
    /*
     * 更新合并过后的条件
     */
    const condition = _inNormalizer($condition, {
        filterType: $terms
    });
    /*
     * 初始化
     */
    return queryRef.init($filters).and(condition).to();
}

/**
 * ## 「标准」`Ux.qrInherit`
 *
 * 计算Qr需要的继承变量，用于继承查询条件专用。
 *
 * 1. 先从props中读取$query变量。
 * 2. 如果未传递props属性中的$query，则从state中读取：`state.query`信息（ListComplex中使用）
 *      * ExListComplex
 *      * ExListQuery
 *      * ExListOpen
 *
 * 以上三个组件为目前使用query继承的组件。
 *
 * @memberOf module:_qr
 * @method qrInherit
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Object} 返回最终的 query 结构。
 */
const qrInherit = (reference) => {
    /*
     * 默认使用 reference.props 中的 $query 信息
     */
    const {$query} = reference.props;
    let defaultQuery = {};
    if ($query) {
        /*
         * props 属性中的 $query 优先
         */
        defaultQuery = Abs.clone($query);
    } else {
        /*
         * 直接从 state 属性中读取 query
         */
        const seekQuery = reference.state ? reference.state.query : {};
        if (seekQuery) {
            defaultQuery = Abs.clone(seekQuery);
        }
    }
    Dev.dgQuery(reference, " qrInherit 继承参数");
    return qrComplex(defaultQuery, reference);
}
export default {
    qrComplex,
    qrCombine,
    qrCommon,
    qrInherit,
    /*
     * 列筛选中配置了 $filter，需要根据 $filter 生成配置
     * 1）$filter 的类型信息
     * 2）$filter 列的数据类型（后端查询需要使用）
     */
    qrTerms,
    /*
     * 清除当前 $condition 的条件
     * 清除当前 $searchText
     */
    qrClear,
    /*
     * 提取参数专用方法
     * 1）qrInput：单字段多值 Or 连接（主要针对单独输入框）
     * 2）qrForm：完整表单（针对Form提交的核心数据）
     */
    qrInput,
    qrForm,
}