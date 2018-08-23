import Immutable from 'immutable';
import Params from './Ux.Param';
import E from './Ux.Error';
import U from 'underscore'
import Dg from './Ux.Debug';
import State from './Ux.State';
import Env from './Ux.Env';

/**
 * 【高阶函数：三阶】用于显示对话框
 * @method onShow
 * @param execFun 二阶执行函数
 * @param effectKey 效果key
 * @return {function(*=): Function}
 */
const onShow = (execFun, effectKey) => (reference) => (event) => {
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
    const state = {};
    state[effectKey] = false;
    reference.setState(state);
    if (execFun) {
        execFun(event, reference);
    }
};

const onDialog = (key) => ({
    show: onShow(null, key),
    hide: onHide(null, key)
});
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
    // E.fxWarning(!props.hasOwnProperty("fnInit"), 10013, fnInit);
    if (fnInit) {
        const $key = props.$key;
        const $prevKey = prevProps.$key;
        if ($key !== $prevKey && $key) {
            fnInit({id: $key});
        }
        // 执行Destory的动作
        cycleDestoryForm(props, prevProps);
    }
};
/**
 * 窗口onOk连接在函数，连接Html元素并设置onOk的触发器
 * @method connectButton
 * @param dialog 传入的dialog窗口配置
 */
const connectDialog = (dialog = {}) => {
    if ("string" === typeof dialog.onOk) {
        // 防止引用切换，必须使用Immutable
        const key = Immutable.fromJS(dialog).toJS();
        dialog.onOk = () => connectId(key.onOk);
    } else {
        // 防重复注入
        E.fxWarning(!U.isFunction(dialog.onOk), 10016, dialog.onOk);
    }
};
/**
 * 链接某个ID的元素
 * @param id
 */
const connectId = (id) => {
    const ele = document.getElementById(id);
    E.fxWarning(!ele, 10015, id);
    if (ele) {
        ele.click();
    }
};
/**
 * 链接Form初始化区分编辑和添加模式专用
 * @param reference
 * @param fnAdd,
 * @param fnUpdate
 */
const pipeIsUpdate = (reference) => {
    const {$key, $mode} = reference.props;
    // 1.没有传入$key的时候是添加
    let isUpdate;
    if ($key) {
        // 2.传入$key过后，需要检查Mode
        if ($mode) {
            // 有$key，$mode为UPDATE时为更新
            isUpdate = $mode === Env.Mode.UPDATE;
        } else {
            // 有$key没有$mode，更新
            isUpdate = true;
        }
    } else {
        // 没有传入Key则是false
        isUpdate = false;
    }
    return isUpdate;
};
const pipeInit = (reference, fnAdd, fnUpdate) => {
    const {$inited} = reference.props;
    // 如果包含了$key则是更新模式
    let data = {};
    // 计算添加还是更新
    if (pipeIsUpdate(reference)) {
        // 更新模式
        if (U.isFunction(fnUpdate)) {
            data = fnUpdate($inited, reference);
        } else {
            // 直接读取$inited
            data = $inited;
        }
        Dg.dgForm(reference, data, true);
    } else {
        // 添加模式
        if (U.isFunction(fnAdd)) {
            data = fnAdd($inited, reference);
        }
        Dg.dgForm(reference, data);
    }
    return data;
};
/**
 * 重置当前表单专用方法
 * @param reference
 * @param dataArray 输入的参数，默认是空值
 */
const pipeReset = (reference, dataArray = []) => {
    const {$items, $inited = {}} = reference.props;
    if ($items && $items.is()) {
        // 读取原来数据
        const data = Immutable.fromJS($items.to()).toJS();
        data[$inited.key] = dataArray;
        State.writeTree(reference, {
            "list.items": data,
        });
    }
};
/**
 * 验证当前的items中是否包含了数据信息
 * @param reference
 */
const pipeVerify = (reference) => {
    return 0 < pipeGet(reference).length
};
const pipeGet = (reference) => {
    const {$items, $inited = {}} = reference.props;
    if ($items && $items.is()) {
        const data = Immutable.fromJS($items.to()).toJS();
        const array = data[$inited.key];
        return array ? array : []
    } else {
        return [];
    }
};
/**
 * @class Op
 * @description 操作专用类
 */
export default {
    // 弹窗专用
    onShow,
    onHide,
    onDialog,
    // 更新
    cycleUpdatePageList,
    cycleUpdateForm,
    cycleDestoryForm,
    // 连接
    connectButton: connectDialog,
    connectDialog,
    connectId,
    // 初始化时的操作
    pipeInit,
    pipeReset,
    pipeVerify,
    pipeGet,
    pipeIsUpdate
}
