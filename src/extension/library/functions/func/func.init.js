import Ux from 'ux';
import To from './func.to';
import U from 'underscore';

/**
 * ## 扩展函数
 *
 * 使用应用数据初始化，自动加载应用配置数据
 *
 * ```js
 *      let $inited = {};
 *      $inited.type = "ENTITY";
 *      const form = Ex.yoForm(this, null, Ex.onApp($inited));
 * ```
 *
 * @memberOf module:_on
 * @param {Object} $inited 初始化应用数据
 * @returns {Object} 返回最终数据
 */
const onApp = ($inited = {}) => {
    const inited = Ux.clone($inited);
    const app = Ux.isInit();
    if (!$inited.appName) {
        inited.appName = app.name;
    }
    if (!$inited.appName) {
        inited.namespace = To.toNamespace(app.name);
    }
    if (undefined === $inited.active) {
        inited.active = true;
    }
    return inited;
};
/**
 * ## 扩展函数
 *
 * 树形菜单专用处理函数
 *
 * ```js
 *      const calculated = Ex.onTree(selected, data, {
 *          mode: $selection.mode,
 *          tree: config.tree,
 *      });
 * ```
 *
 * @memberOf module:_on
 * @param {Array} keys 配置数据信息
 * @param {Array} data 树相关数据源
 * @param {Object} config 树相关配置
 * @returns {Array} 返回最终树信息
 */
const onTree = (keys = [], data = [], config = {}) => {
    const source = Ux.toTreeArray(data, config.tree);
    let treeArray = [];
    if (config.mode) {
        const fun = Ux.Tree[config.mode];
        if (U.isFunction(fun)) {
            const result = fun(keys, source);
            const $result = Ux.immutable(result);
            treeArray = data.filter(each => $result.contains(each.key));
        }
    }
    return treeArray;
};
export default {
    onApp,
    onTree,
}