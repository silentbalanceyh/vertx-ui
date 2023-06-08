import __Zs from 'zs';

/**
 * ## 「标准」`Ux.aiYN`
 *
 * @memberOf module:ai-web/zest
 * @param value
 * @returns {*|boolean}
 */
const aiYN = (value) => __Zs.aiYN(value);
/**
 * ## 「标准」`Ux.aiIcon`
 * 针对图标进行处理，类型包含icon和image两种
 *
 * * 如果type以`img:`开头，则使用`<img/>`标签
 * * 其他情况则使用Ant Design中的`<Icon/>`处理
 *
 * @memberOf module:ai-web/zest
 * @param {String} type 传入的字符串值
 * @param {Object} addOn 附加配置
 * @return {*}
 */
const aiIcon = (type, addOn = {}) => __Zs.aiIcon(type, addOn);
/**
 * ## 「标准」`Ux.aiErrorInput`
 *
 * @memberOf module:ai-web/zest
 * @param reference
 * @param condition
 * @returns {*|boolean}
 */
const aiErrorInput = (reference, condition = true) =>
    __Zs.aiErrorInput(reference, condition);

/**
 * ## 「标准」`Ux.aiChildren`
 *
 * @memberOf module:ai-web/zest
 * @param reference
 * @param additional
 * @returns {*}
 */
const aiChildren = (reference, additional = {}) =>
    __Zs.aiChildren(reference, additional);

/**
 * ## 「标准」`Ux.aiUrl`
 *
 * 链接计算专用方法，第二参`addOn`中包含了`$router`（DataRouter）对象。
 *
 * ### 1.基本说明
 *
 * 代码逻辑分为两部分：基础路径计算和参数计算。
 *
 * 1. 先根据`uri`计算基础路径。
 * 2. 再追加特定的参数信息到链接后缀中。
 *
 * ### 2.基础路径baseUri
 *
 * |uri|说明|
 * |---|:---|
 * |$MAIN$|该值计算该链接路径为`Z_ENTRY_ADMIN`（环境变量中配置的主界面）|
 * |$SELF$|该值会将链接设置成当前页面（`$router.uri()`）|
 * |其他|1）根据`/`符号的结尾符号执行链接规范化。2）根据`Z_ROUTE`配置追加应用路径。|
 *
 * ### 3.查询参数
 *
 * 1. 先计算路径尾部是否包含`?`操作符。
 * 2. 维持`mid`和`pid`的基础值。
 *
 * |参数名|含义|
 * |---|:---|
 * |mid|Menu主键（主菜单参数值）|
 * |pid|Page主键（页面参数值，二级菜单主键）|
 *
 * > 此处的`mid`和`pid`是为了用户在点击`F5`时维持菜单的开合状态而设置，所以在编程过程中避免使用`mid`和`pid`等参数值。
 *
 * @memberOf module:ai-web/zest
 * @param {Object} item 每一个元素的基本配置。
 * @param {Object} addOn 附加属性，应用于内容层。
 * @returns {String} 跳转链接
 */
const aiUrl = (item = {}, addOn = {}) =>
    __Zs.aiUrl(item, addOn);


/**
 * ## 「标准」`Ux.aiLink`
 *
 * 链接渲染专用流程。
 *
 * ### 1.item的数据结构
 *
 * ```js
 * {
 *     "uri": "链接地址",
 *     "disabled": "是否禁用该链接",
 *     "className": "Css中对应的className",
 *     "text": "文本数据",
 *     "__uri": (event) => {
 *          // onClick函数，Function
 *     }
 * }
 * ```
 *
 * ### 2. 分流程操作
 *
 * #### 2.1. 条件矩阵
 *
 * |编号|uri|disabled|__uri|
 * |---|:---|:---|:---|
 * |A|无值或`EXPAND`|x|x|
 * |B|有值不为`EXPAND`|true|x|
 * |C|有值不为`EXPAND`|false|Function|
 * |D「默认」|有值不为`EXPAND`|false|无|
 *
 *
 * #### 2.2. 条件流程
 *
 * |条件|Jsx元素|流程说明|
 * |:---|:---|:---|
 * |A|`<span/>`|直接显示文本，不显示链接，`<span/>`元素。|
 * |B|`<span/>`|直接显示禁用文本，带`ux-disabled`的className，`<span/>`元素。|
 * |C|`<a/>`|渲染链接，onClick绑定`__uri`，`<a/>`元素。|
 * |D「默认」|`<Link/>`|（react-router）根据item生成`to`属性，`<Link/>`元素，生成调用`aiUrl`函数。|
 *
 * ### 3. 额外说明
 *
 * 系统中使用了`react-router`，而在`addOn`参数中，通常会传入`$router`变量（DataRouter）以方便在链接中触发路由事件。
 * 路由中的onClick事件必须执行如下流程：
 *
 * 1. 调用`event.preventDefault`（或`Ux.prevent`）禁用`<a/>`的默认行为。
 * 2. 然后调用`Ux.toRoute`来执行链接的跳转（这种做法和直接触发`<Link/>`中的`to`类似）。
 *
 * @memberOf module:ai-web/zest
 * @param {Object} item 每一个元素的基本配置。
 * @param {Object} addOn 附加属性，应用于内容层。
 * @returns {JSX.Element}
 */
const aiLink = (item = {}, addOn = {}) =>
    __Zs.aiLink(item, addOn);
/**
 * ## 「标准」`Ux.aiTitle`
 *
 * @memberOf module:ai-web/zest
 * @param item
 * @param addOn
 * @returns {*}
 */
const aiTitle = (item = {}, addOn = {}) =>
    __Zs.aiTitle(item, addOn);
/**
 * ## 「标准」`Ux.aiCell`
 *
 * @memberOf module:ai-web/zest
 * @param Element
 * @param attrs
 * @param text
 * @returns {*}
 */
const aiCell = (Element, attrs = {}, text) =>
    __Zs.aiCell(Element, attrs, text);
/**
 * ## 「标准」`Ux.aiBlock`
 *
 * @memberOf module:ai-web/zest
 * @param icon
 * @param text
 * @param key
 * @returns {*}
 */
const aiBlock = (icon, text, key) =>
    __Zs.aiBlock(icon, text, key);
/**
 * ## 「标准」`Ux.aiEmpty`
 *
 * @memberOf module:ai-web/zest
 * @param size
 * @returns {*}
 */
const aiEmpty = (size = 30) =>
    __Zs.aiEmpty(size);
/**
 * ## 「标准」`Ux.aiAnchor`
 *
 * @memberOf module:ai-web/zest
 * @param item
 * @param onClick
 * @param defaultType
 * @returns {*}
 */
const aiAnchor = (item = {}, onClick, defaultType = "BUTTON") =>
    __Zs.aiAnchor(item, onClick, defaultType);
/**
 * ## 「标准」`Ux.aiItemTransfer`
 *
 * @memberOf module:ai-web/zest
 * @param item
 * @param reference
 * @returns {*|string}
 */
const aiItemTransfer = (item, reference) =>
    __Zs.aiItemTransfer(item, reference);
/**
 * ## 「标准」`Ux.aiViewMy`
 *
 * @memberOf module:ai-web/zest
 * @param config
 * @param reference
 * @returns {*}
 */
const aiViewMy = (config = {}, reference) =>
    __Zs.aiViewMy(config, reference);
/**
 * ## 「标准」`Ux.aiErrorPage`
 *
 * @memberOf module:ai-web/zest
 * @param error
 * @returns {*}
 */
const aiErrorPage = (error = {}) =>
    __Zs.aiErrorPage(error);


// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // Child
    aiChildren,
    /**
     * ## 「标准」`Ux.aiChild`
     *
     * @memberOf module:ai-web/zest
     * @method aiChild
     */
    aiChild: __Zs.aiChild,

    aiYN,       // 图标是否（专用简易处理）
    aiIcon,     // 图标解析
    aiUrl,      // 路由表地址解析
    aiLink,     // 链接解析
    aiTitle,    // 标题解析
    aiCell,     // 单元格解析
    aiBlock,    // 上边文字 / 下边图标
    aiEmpty,    // 空处理
    aiAnchor,   // 连接 / 按钮 双执行处理

    aiErrorPage,        // 异常页面渲染
    aiErrorInput,       // 异常输入

    aiItemTransfer, // Transfer Item 专用
    aiViewMy,
}