import {_TreeProc} from 'zo';

/**
 * ## 「标准」`Ux.tree`
 *
 * 构造内置树结构，提供核心方法执行快速构造
 *
 * * build：构造树结构
 * * getRoots：根节点执行
 *
 * @memberOf module:tree/zodiac
 * @method tree
 * @param {Object|ReactComponent} reference React组件
 * @returns {TreeProc} 返回内置树结构
 */
export default (reference) => new _TreeProc(reference)