import __Zs from 'zs';
import __Zi from 'zi';

/**
 * ## 「标准」`Ux.aiTree`
 *
 *
 * @memberOf module:ai-web/zest
 * @param item
 * @param rest
 * @returns {*}
 */
const aiTree = (item = {}, rest = {}) => __Zs.aiTree(item, rest);
/**
 * ## 「标准」`Ux.aiField`
 *
 * @memberOf module:ai/zest
 * @param reference
 * @param values
 * @param raft
 * @returns {*}
 */
const aiField = (reference, values = {}, raft = {}) =>
    __Zs.aiField(reference, values, raft);
/**
 * ## 「标准」`Ux.aiInit`
 *
 * @memberOf module:ai/zion
 * @param reference
 * @param values
 * @returns {*}
 */
const aiInit = (reference, values) =>
    __Zi.xtInited(reference, values);
/**
 * ## 「标准」`Ux.aiForm`
 *
 * @memberOf module:ai/zest
 * @param reference
 * @param values
 * @param configuration
 * @returns {*}
 */
const aiForm = (reference, values, configuration = {}) =>
    __Zs.aiForm(reference, values, configuration);
/**
 * ## 「标准」`Ux.aiFormInput`
 *
 * @memberOf module:ai/zest
 * @param reference
 * @param values
 * @param raft
 * @returns {*}
 */
const aiFormInput = (reference, values, raft = {}) =>
    __Zs.aiFormInput(reference, values, raft);
/**
 * ## 「标准」`Ux.aiFormField`
 *
 * @memberOf module:ai/zest
 * @param reference
 * @param fieldConfig
 * @param fnJsx
 * @returns {*|boolean}
 */
const aiFormField = (reference, fieldConfig = {}, fnJsx) =>
    __Zs.aiFormField(reference, fieldConfig, fnJsx);
// ---------------- O.tab.js
/**
 * ## 「标准」`Ux.aiTabPage`
 *
 * @memberOf module:ai-web/zest
 * @param reference
 * @param children
 * @returns {*}
 */
const aiTabPage = (reference, children = {}) => __Zs.aiTabPage(reference, children);
/**
 * ## 「标准」`Ux.aiTabExtra`
 *
 *
 * @memberOf module:ai-web/zest
 * @param reference
 * @param config
 * @returns {*}
 */
const aiTabExtra = (reference, config = {}) => __Zs.aiTabExtra(reference, config);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 页签专用
    aiTabPage,
    aiTabExtra,
    // 表单专用
    aiTree,
    aiForm,
    aiInit, // 统一处理
    aiField,
    aiFormInput,
    aiFormField,
}