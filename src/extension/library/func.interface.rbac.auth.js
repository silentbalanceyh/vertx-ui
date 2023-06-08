// 跳级处理
import __Zp from 'zep';

/**
 * ## 「引擎」`Ex.authGroups`
 *
 * ### 1.基本介绍
 *
 * 1. 根据传入的 treeData 提取 resource.tree 构造分类
 * 2. 读取远程的权限组，权限组挂在分类下边
 *
 * > 该方法用于在管理过程中将资源和权限进行树形分组，生成引导菜单。
 *
 * @memberOf module:upper/auth
 * @async
 * @param {State|Object} state 当前组件状态信息
 * @param {Array} types 资源树类型定义信息
 * @returns {Promise<*>}
 */
const authGroups = (state = {}, types = []) =>
    __Zp.authGroups(state, types);
/**
 * ## 「引擎」`Ex.authTreeRes`
 *
 * ### 1.基本介绍
 *
 * 1. 直接读取 resource.tree 中的内容
 * 2. 遇到 ID:XXX 需要执行判断，进行深度树的二次读取
 * 3. 最终构造完成的树形数组（parentId一致）
 *
 * @memberOf module:upper/auth
 * @async
 * @param {State|Object} state React组件状态
 * @returns {Promise<*>}
 */
const authTreeRes = (state = {}) =>
    __Zp.authTreeRes(state);
export default {
    authGroups,
    authTreeRes,
}