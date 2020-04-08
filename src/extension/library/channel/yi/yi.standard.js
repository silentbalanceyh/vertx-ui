import yiModule from "./yi.module";
import yiAssist from './yi.assist';
import Ux from 'ux';

import yiRouterType from "./yi.router.type";

/**
 * ## 扩展函数
 *
 * 标准核心模块专用方法，内部调用函数
 *
 * 1. yiModule
 * 2. 路由信息：/xxx/yyy/:type --> type,= <value>
 * 3. yiAssist
 *
 * @memberOf module:_channel
 * @method yiStandard
 * @param {ReactComponent} reference React对应组件引用
 * @param {State} inputState 返回当前组件状态
 * @returns {Promise<T>} 执行更新过后的状态
 */
export default (reference, inputState) => {
    /*
     * 读取参数信息
     */
    const state = {};
    if (Ux.isObject(inputState)) {
        Object.assign(state, inputState);
    }
    return yiModule(reference, state)
        /* 第一种用法 */
        .then(Ux.pipe(reference))
        .then(data => yiAssist(reference, data))
        .then(data => yiRouterType(reference, data))
        /* 第二种用法 */
        .then(Ux.ready)
}