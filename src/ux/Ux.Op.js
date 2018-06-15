import Log from './Ux.Log';
import Dialog from './Ux.Dialog';
import Dg from './Ux.Debug';
import State from './Ux.State';
import Immutable from 'immutable';
import Params from './Ux.Param';
import U from 'underscore'

/**
 * 【高阶函数：三阶】提交专用三阶生成函数
 * @method onSubmit
 * @param execFun 二阶执行函数
 * @param effectKey 效果key
 * @return {function(*=): Function}
 */
const onSubmit = (execFun, effectKey) => (reference) => (event) => {
    Dg.ensureAttr("onSubmit", effectKey);
    event.preventDefault();
    const {form} = reference.props;
    const refresh = {};
    refresh[effectKey] = true;
    reference.setState(refresh);
    form.validateFieldsAndScroll((error, values) => {
        if (error) {
            refresh[effectKey] = false;
            reference.setState(refresh);
            return;
        }
        const promise = execFun(values, reference);
        if (promise) {
            promise.catch(error => {
                Log.error(error);
                refresh[effectKey] = false;
                reference.setState(refresh);
                if (error.info) {
                    Dialog.showError(reference, error.info);
                }
            })
        }
    })
};
/**
 * 【高阶函数：三阶】用于显示对话框
 * @method onShow
 * @param execFun 二阶执行函数
 * @param effectKey 效果key
 * @return {function(*=): Function}
 */
const onShow = (execFun, effectKey) => (reference) => (event) => {
    Dg.ensureAttr("onShow", effectKey);
    const state = {};
    state[effectKey] = true;
    reference.setState(state);
    if (execFun) {
        execFun(event, reference);
    }
};
/**
 * 【高阶函数：三阶】用于隐藏对话框
 * @method onHide
 * @param execFun 二阶执行函数
 * @param effectKey 效果key
 * @return {function(*=): Function}
 */
const onHide = (execFun, effectKey) => (reference) => (event) => {
    Dg.ensureAttr("onHide", effectKey);
    const state = {};
    state[effectKey] = false;
    reference.setState(state);
    if (execFun) {
        execFun(event, reference);
    }
};
/**
 * 【高阶函数：二阶】搜索专用函数
 * @method onSearch
 * @param {React.PureComponent} reference React对应组件引用
 * @return {Function}
 */
const onSearch = (reference) => (event) => {
    event.preventDefault();
    const {form} = reference.props;
    let values = {};
    if (form) {
        values = form.getFieldsValue();
    }
    State.writeTree(reference, {
        "query.filters": values,
        "datum.data": undefined
    });
};
/**
 * 【高阶函数：二阶】重置搜索条件函数，用于高级搜索专用
 * @method onResetFilter
 * @param {React.PureComponent} reference React对应组件引用
 * @return {Function}
 */
const onResetFilter = (reference) => (event) => {
    event.preventDefault();
    const {form} = reference.props;
    if (form) {
        form.resetFields();
    }
    State.writeTree(reference, {
        "query.filters": {},
        "datum.data": undefined
    });
};
/**
 *
 * componentDidUpdate中的List专用生命周期函数
 * @method cycleUpdatePageList
 * @param {React.PureComponent} reference React对应组件引用
 * @param key 数据对应的props中的键值，默认使用`$list`；
 * @param prevProps 之前的属性信息
 */
const cycleUpdatePageList = (reference = {}, key = 'list', prevProps = {}) => {
    const data = reference.props[`$${key}`];
    if (!data) {
        const {fnData} = reference.props;
        if (fnData) {
            // 查询条件规范化
            const query = Params.parseQuery(reference);

            fnData(query);
        }
    }
};
/**
 * componentDidUnmount生命的Form专用函数
 * @method cycleDestoryForm
 * @param props 当前属性
 * @param prevProps 之前属性
 */
const cycleDestoryForm = (props = {}, prevProps = {}) => {
    // 销毁函数
    const $destory = props.$destory;
    const $prevDestory = prevProps.$destory;
    if ($destory !== $prevDestory && $destory) {
        const {form} = props;
        if (form) {
            // 因为是销毁，不做Reset，而是直接青空所有表单值
            form.resetFields();
        }
    }
    // 路由切换时重设表单函数
    const $router = props.$router;
    const $prevRouter = prevProps.$router;
    if ($router && $prevRouter) {
        if ($router.path() !== $prevRouter.path()) {
            // 重设Form，Reset当前表单
            const {form} = props;
            if (form) {
                form.resetFields();
            }
        }
    }
};
/**
 * componentDidUpdate的Form组件生命周期专用函数
 * @method cycleUpdateForm
 * @param props 当前属性
 * @param prevProps 之前属性
 */
const cycleUpdateForm = (props = {}, prevProps = {}) => {
    const {fnInit} = props;
    if (fnInit) {
        const $key = props.$key;
        const $prevKey = prevProps.$key;
        if ($key !== $prevKey && $key) {
            fnInit({id: $key});
        }
        // 执行Destory的动作
        cycleDestoryForm(props, prevProps);
    } else {
        console.warn("[ Cycle ] System does not detect 'fnInit' function.", fnInit);
    }
};
/**
 * 【高阶函数：二阶】高级搜索专用函数调用，用于分页列表中的分页、过滤、排序同时处理的函数，和Table组件的onChange配合使用
 * @method onAdvanced
 * @param {React.PureComponent} reference React对应组件引用
 * @return {Function}
 */
const onAdvanced = (reference = {}) => (pagination, filters, sorter) => {
    const {$query, fnData, fnOut} = reference.props;
    if (fnData && fnOut) {
        // 分页参数
        $query.pager.page = pagination.current;
        $query.pager.size = pagination.pageSize;
        const keys = Object.keys(sorter);
        // 排序参数
        if (0 < keys.length) {
            let sorting = sorter.field;
            sorting += "," + ("descend" === sorter.order ? "ASC" : "DESC");
            $query.sorter = [sorting];
        } else {
            delete $query.sorter;
        }
        // 查询条件规范化
        const query = Params.parseQuery(reference, $query);
        fnData(query);
    }
};
/**
 * 窗口onOk连接在函数，连接Html元素并设置onOk的触发器
 * @method connectButton
 * @param dialog 传入的dialog窗口配置
 */
const connectButton = (dialog = {}) => {
    if ("string" === typeof dialog.onOk) {
        // 防止引用切换，必须使用Immutable
        const key = Immutable.fromJS(dialog).toJS();
        dialog.onOk = () => connectId(key.onOk);
    } else {
        // 防重复注入
        if (!U.isFunction(dialog.onOk)) {
            console.warn("[Zero-Connect] Connect key onOk = \"" + dialog.onOk + "\" is missing.");
        }
    }
};
/**
 * 链接某个ID的元素
 * @param id
 */
const connectId = (id) => {
    const ele = document.getElementById(id);
    if (ele) {
        console.info("[Zero-Connect] Html element " + id + " connected !");
        ele.click();
    } else {
        console.warn("[Zero-Connect] Element '" + id + "' does not exist.");
    }
};
/**
 * 顶部工具栏专用连接函数，连接Html元素并设置不同button函数
 * @method connectTopbar
 * @param topbar 顶部工具栏的工具配置
 * @param key 待连接的配置键值
 */
const connectTopbar = (topbar = {}, key) => {
    if (key && topbar.buttons && Array.prototype.isPrototypeOf(topbar.buttons[key])) {
        const buttons = Immutable.fromJS(topbar.buttons[key]).toJS();
        buttons.forEach(button => {
            // 防重复注入
            if (!U.isFunction(button.onClick)) {
                button.onClick = () => connectId(button.key)
            }
        });
        topbar.buttons[key] = buttons;
    } else {
        if (!topbar.buttons) {
            console.warn("[ Cycle ] Connect topbar.buttons is invalid.");
        }
    }
};
/**
 * 高阶函数生成，用于简易的状态设置
 * @method hgValue
 * @param reference
 * @param key
 * @returns {Function}
 */
const hgValue = (reference, key) => (event) => _hgSet(reference, key, event);
const _hgSet = (reference, key, value) => {
    if (key && undefined !== value) {
        const state = {};
        state[key] = value;
        reference.setState(state);
    }
};
/**
 * 高阶函数生成，用于简易的状态设置，true
 * @method hgTrue
 * @param reference
 * @param key
 * @returns {Function}
 */
const hgTrue = (reference, key) => () => _hgSet(reference, key, true);
/**
 * 高阶函数生成，用于简易状态设置，false
 * @method hgFalse
 * @param reference
 * @param key
 * @returns {function(): void}
 */
const hgFalse = (reference, key) => () => _hgSet(reference, key, false);
/**
 * @class Op
 * @description 操作专用类
 */
export default {
    onSubmit,
    onShow,
    onHide,
    onResetFilter,
    onSearch,
    onAdvanced,
    // 高阶函数
    hgValue,
    hgTrue,
    hgFalse,
    // 更新
    cycleUpdatePageList,
    cycleUpdateForm,
    cycleDestoryForm,
    // 连接
    connectButton,
    connectTopbar,
    connectId,
}
