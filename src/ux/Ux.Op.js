import Immutable from 'immutable';
import Params from './Ux.Param';
import E from './Ux.Error';
import U from 'underscore'

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
    E.fxWarning(!props.hasOwnProperty("fnInit"), 10013, fnInit);
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
const connectButton = (dialog = {}) => {
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
 * @class Op
 * @description 操作专用类
 */
export default {
    // 弹窗专用
    onShow,
    onHide,
    // 更新
    cycleUpdatePageList,
    cycleUpdateForm,
    cycleDestoryForm,
    // 连接
    connectButton,
    connectId,
}
