import __Zs from 'zs';

/**
 * ## 「标准」`Ux.aiBreadcrumb`
 *
 * 面包屑的渲染，使用Ant中的`<Breadcrumb/>`元素执行导航渲染
 *
 * 1. 外层使用`<Breadcrumb/>`。
 * 2. 元素使用`<Breadcrumb.Item/>`。
 * 3. 元素内使用`Ux.aiLink`方法渲染链接地址。
 *
 * @memberOf module:ai-web/zest
 * @param {Array} items 每一个链接的配置信息
 * @param {Object} rest 根属性对象
 * @param {Object} addOn 附加属性，应用于内容层
 * @returns {JSX.Element}
 */
const aiBreadcrumb = (items = [], rest = {}, addOn = {}) =>
    __Zs.aiBreadcrumb(items, rest, addOn);
// ------------------- 上边为特殊方法 -----------------------
/**
 * ## 「标准」`Ux.aiMenuTop`
 *
 * @memberOf module:ai-web/zest
 * @param items
 * @param rest
 * @param addOn
 * @returns {*}
 */
const aiMenuTop = (items = [], rest = {}, addOn = {}) =>
    __Zs.aiMenuTop(items, rest, addOn);
/**
 * ## 「标准」`Ux.aiMenuContext`
 *
 * @memberOf module:ai-web/zest
 * @param items
 * @param rest
 * @returns {*}
 */
const aiMenuContext = (items = [], rest = {}) =>
    __Zs.aiMenuContext(items, rest);
/**
 * ## 「标准」`Ux.aiSider`
 *
 * @memberOf module:ai-web/zest
 * @param items
 * @param rest
 * @param addOn
 * @returns {*}
 */
const aiSider = (items = [], rest = {}, addOn = {}) =>
    __Zs.aiSider(items, rest, addOn);
/**
 * ## 「标准」`Ux.aiLinkMore`
 *
 * @memberOf module:ai-web/zest
 * @param config
 * @param reference
 * @returns {*}
 */
const aiLinkMore = (config = {}, reference) =>
    __Zs.aiLinkMore(config, reference);

/**
 * ## 「标准」`Ux.aiLinkBack`
 *
 * @memberOf module:ai-web/zest
 * @param reference
 * @param attrs
 * @returns {*}
 */
const aiLinkBack = (reference, attrs = {}) =>
    __Zs.aiLinkBack(reference, attrs);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    aiBreadcrumb,       // （面包屑）<Breadcrumb/>
    aiMenuTop,          // （完整）带 <Menu/>
    aiSider,            // （完整）带 <Menu/>
    aiMenuContext,      // （完整）右键菜单专用 <ContextMenu/>

    aiLinkMore,         // （按钮）<Button/>
    aiLinkBack,         // （按钮）<Button/>
}