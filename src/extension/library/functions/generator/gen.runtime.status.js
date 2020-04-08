import Cm from './gen.common';
import Ux from 'ux';
import {Dsl} from 'entity';

/**
 * ## 扩展函数「2阶」
 *
 * $visible 生成函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} visible 打开或关闭
 * @returns {Function} 生成函数
 */
const rsVisible = (reference, visible = true) =>
    Cm.boolean(reference, "$visible", visible);
/**
 * ## 扩展函数「2阶」
 *
 * $loading 生成函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} loading 打开或关闭
 * @returns {Function} 生成函数
 */
const rsLoading = (reference, loading = true) =>
    Cm.boolean(reference, "$loading", loading);
/**
 * ## 扩展函数「2阶」
 *
 * $submitting 生成函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} submitting 打开或关闭
 * @returns {Function} 生成函数
 */
const rsSubmitting = (reference, submitting = true) =>
    Cm.boolean(reference, "$submitting", submitting);
/**
 * ## 扩展函数「2阶」
 *
 * $dirty 生成函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} dirty 打开或关闭
 * @returns {Function} 生成函数
 */
const rsDirty = (reference, dirty = true) =>
    Cm.boolean(reference, "$dirty", dirty);
const rsOpened = (reference, opened = true) =>
    Cm.boolean(reference, "$opened", opened);
export default {
    rsVisible,
    rsLoading,
    rsSubmitting,
    rsDirty,
    /**
     * ## 扩展函数
     *
     * 打开Tab页后置回调函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxPostClose: (reference) => (key) => rsOpened(reference, false)(key),
    /**
     * ## 扩展函数
     *
     * 关闭Tab页后置回调函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxPostOpen: (reference) => (data) => rsOpened(reference, true)(data),

    /**
     * ## 扩展函数
     *
     * 加载状态切换函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxLoading: (reference) => (loading, addOn = {}) => rsLoading(reference, loading)(addOn),
    /**
     * ## 扩展函数
     *
     * 提交状态切换函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxSubmitting: (reference) => (submitting, addOn = {}) => rsSubmitting(reference, submitting)(addOn),
    /**
     * ## 扩展函数
     *
     * 脏状态切换函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxDirty: (reference) => (dirty, addOn = {}) => rsDirty(reference, dirty)(addOn),
    /**
     * ## 扩展函数
     *
     * 辅助数据专用函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxAssist: (reference) => (key, data, deleted = false) => {
        const saved = Ux.onSave(reference, key, data, deleted);
        if (saved && Ux.isArray(saved)) {
            /*
             * 写 $a_<key> 专用
             */
            const $key = Ux.toKey(key);
            const state = {};
            state[$key] = Dsl.getArray(saved);
            reference.setState(state);
        }
    }
}