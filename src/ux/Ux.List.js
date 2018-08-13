import Value from './Ux.Value';
import Immutable from 'immutable';
import U from 'underscore';
import Prop from './Ux.Prop';
import Ux from "ux";

const irPager = (hoc = {}) => {
    let pager = {};
    if (hoc.pager) {
        if ("string" === typeof hoc.pager) {
            const pageData = hoc.pager.split(',');
            pager.page = Value.valueInt(pageData[0]);
            pager.size = Value.valueInt(pageData[1]);
        } else {
            pager = Immutable.fromJS(hoc.pager).toJS();
        }
    }
    return pager;
};

const irProjection = (hoc = {}) => {
    let projection = [];
    if (U.isArray(hoc.projection)) {
        projection = Immutable.fromJS(hoc.projection).toJS();
    }
    return projection;
};

const irSorter = (hoc = {}) => {
    let sorterData = [];
    if (hoc.sorter) {
        if (U.isArray(hoc.sorter)) {
            sorterData = Immutable.fromJS(hoc.sorter).toJS();
        } else {
            const sorters = hoc.sorter.split(',');
            sorters.forEach(sorter => {
                const kv = sorter.replace(/ /g, '').split('=');
                const sorterItem = `${kv[0]},${kv[1]}`;
                sorterData.push(sorterItem);
            })
        }
    }
    return sorterData;
};

const irCriteria = (hoc = {}, props = {}) => {
    let config = {};
    if (hoc.criteria) {
        if ("string" === typeof hoc.criteria) {
            // 1.直接字符串条件
            const condition = hoc.criteria.split(',');
            condition.forEach(cond => {
                const kv = cond.replace(/ /g, '').split('=');
                config[kv[0]] = kv[1]
            })
        } else if (U.isArray(hoc.criteria)) {
            hoc.criteria.filter(cond => "string" === typeof cond)
                .forEach(cond => {
                    // 2.1.数组中的元素是字符串
                    const kv = cond.replace(/ /g, '').split('=');
                    config[kv[0]] = kv[1]
                })
        } else {
            // 3.本身就是一个对象，将该对象传入到config中进行解析
            config = Immutable.fromJS(hoc.criteria).toJS();
        }
    }
    return Value.valueSearch(config, props);
};

const irGrid = (hoc = {}, props = {}) => {
    const query = {};
    // pager专用处理
    query.pager = irPager(hoc);
    // projection专用处理
    query.projection = irProjection(hoc);
    // sorter专用处理
    query.sorter = irSorter(hoc);
    // criteria条件处理
    query.criteria = irCriteria(hoc, props);
    return query;
};

const irKeepCond = (reference = {}) => {
    // 让搜索表单保存查询当前搜索条件
    const {term = ""} = reference.state;
    const grid = Prop.fromHoc(reference.props.reference, "grid");
    if (grid && grid.options) {
        const options = grid.options;
        if (options['search.enabled']) {
            const cond = options['search.cond'];
            const inited = {};
            cond.forEach(item => inited[item] = term);
            return inited;
        }
    }
    return {};
};

const irClear = (reference = {}) => (event) => {
    const ref = reference.props.reference;
    const queryConfig = Ux.fromHoc(ref, "grid").query;
    const query = Ux.irGrid(queryConfig, ref.props);
    // 清除快速搜索框中的搜索结果
    const {fnTerm} = reference.props;
    if (fnTerm) fnTerm();
    Ux.writeTree(ref, {
        "grid.query": query,
        "grid.list": undefined
    });
    Prop.formReset(reference);
};

const irFilter = (reference = {}, postFun) => {
    const {form} = reference.props;
    Ux.E.fxTerminal(!form, 10020, form);
    if (form) {
        form.validateFieldsAndScroll((error, values) => {
            if (error) {
                return;
            }
            const params = Immutable.fromJS(values).toJS();
            Value.valueValid(params, true);
            const {$query, fnClose, fnQueryDefault, fnTerm} = reference.props;
            if ($query.is()) {
                // 读取当前的查询条件
                let query = $query.to();
                if (!query.criteria) query.criteria = {};
                if (0 < Object.keys(params).length) {
                    query.criteria["$2"] = params;
                    query.criteria[""] = true;
                } else {
                    // 读取默认的Query，表单不传值
                    if (fnQueryDefault) {
                        query = fnQueryDefault();
                    }
                }
                // 后期处理，如果传入的话可调用
                if (U.isFunction(postFun)) {
                    query = postFun(query, reference);
                }
                // 最终写查询树
                Ux.writeTree(reference, {
                    "grid.query": query,
                    "grid.list": undefined
                });
                // 恢复查询条件
                if (fnTerm) {
                    const {$cond = []} = reference.props;
                    let term = "";
                    $cond.forEach(field => {
                        if (params.hasOwnProperty(field)) {
                            term = params[field];
                            return;
                        }
                    });
                    fnTerm(term);
                }
                // 关闭抽屉
                if (fnClose) fnClose();
            }
        });
    }
};
const MESSAGE = {
    "c": ":field包含\":value\""
};
const irMessage = (prefix = "", criteria = {}, config = {}) => {
    if (0 < Object.keys(criteria).length) {
        const message = [];
        Ux.itObject(criteria, (fieldExpr, value) => {
            const fieldName = fieldExpr.split(',')[0];
            if (config[fieldName]) {
                const field = config[fieldName];
                const flag = fieldExpr.split(',')[1];
                const expr = MESSAGE[flag];
                const item = Ux.formatExpr(expr, {field, value});
                message.push(item);
            }
        });
        return prefix + "：" + message.join("、");
    }
};
export default {
    irMessage,
    irGrid,
    irKeepCond,
    irClear,
    irFilter
}