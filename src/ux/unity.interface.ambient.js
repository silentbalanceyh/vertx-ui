// 导入当前目录
// 导入外层

import __Zi from 'zi';
import __Zo from 'zo';
import __Zn from 'zone';

/**
 * ## 「标准」`Ux.toQuery`
 *
 * 直接读取查询路径中的查询参数，如：`/uri?name=value&name1=value1`。
 *
 * ```js
 * import Ux from 'ux';
 *
 * const value = Ux.toQuery("name");
 * const value1 = Ux.toQuery("name1");
 * // value 的值是 "value";
 * // value1 的值是 "value1";
 * ```
 *
 * 特殊点需要说明：特殊参数 target 会在读取过程中进行判断：
 *
 * 1. 如果 target = x 的 x 中包含了 '/'，则表示当前的target不需要执行Base64的decoding操作。
 * 2. 在 '/' 之外，target参数会被Base64算法执行解码操作，还原原始的链接信息。
 *
 * @memberOf module:to/zone
 * @param {String} name 需要读取的查询参数名称。
 * @return {string|null} 返回读取的参数值。
 */
const toQuery = (name = "") => __Zn.toQuery(name);
/**
 * ## 「标准」`Ux.toQueryKv`
 *
 * @memberOf module:to/zone
 * @param url
 */
const toQueryKv = (url) => __Zn.kvQuery(url);
/**
 * ## 「引擎」`Ux.toRoute`
 *
 * 执行 react-router 的路由跳转功能，路由地址中可以包含前缀，也可以不包含前缀，但框架内部会存在内部逻辑。
 *
 * ### 1. 特殊参数
 *
 * 1）mid为特殊参数，表示模块信息，对应动态中的module（app, module, page）
 * 2）pid为特殊参数，表示页面信息，对应动态中的page（app, module, page）
 * 3）target为Base64处理过的目标变量，它表示当前页面如果调用toRoute失败时会直接执行target页面
 *
 * ### 2. 参数读取流程
 *
 * 1. 如果params中传入了mid, pid，那么优先考虑params中的值：
 *      1. 如果是二参调用，则追加mid / pid参数到目标页面中（标准菜单处理办法）
 *      2. 如果是三参调用，只提供mid，则表示模块页面路由
 *      3. 如果是三参调用，提供了mid和pid，则表示直接引导到模块中的某个页面
 * 2. 如果params中传入了target，则追加target参数并执行Base64编码，如果没传该参数则直接忽略
 * 3. 其他参数直接忽略掉，不执行传入，除非在params中传入新参数。
 *
 * ### 3. 路径解析流程
 *
 * 1. 先处理基础路径
 *      1. 如果基础路径中包含了参数如：uri?p1=v1&p2=v2，则追加参数时`&`为前缀 --> baseUri
 *      2. 如果基础路径以`Z_ROUTE`为前缀，则不追加路由前缀，如果不以`Z_ROUTE`为前缀，则追加`Z_ROUTE`前缀，react-router专用
 * 2. 参数对部分，主要考虑前缀信息，如果本身路径带了参数，则前缀使用`&`符号（追加参数模式），如果路径本身不带参数，则前缀使用`?`符号（设置参数模式）
 *
 * @memberOf module:to/zion
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {String} uri 跳转路由信息，会追加`CV["ROUTE"]`的前缀执行跳转。
 * @param {Object} params 当前路由所需参数信息
 *
 */
const toRoute = (reference = {}, uri = "", params = {}) =>
    __Zi.toRoute(reference, uri, params);
/**
 * ## 「标准」`Ux.toProtocol`
 *
 * 将一个合法协议地址解析成对象
 *
 * * 协议格式如`<protocol>://<username>:<password>@<hostname>:<port>/<path>`
 * * 账号部分为`<username>:<password>`，是可选的。
 * * 端口部分可没有`<hostname>:<port>`和`<hostname>`两种格式都是合法的。
 *
 * 最终解析的结果如：
 *
 * ```json
 * {
 *     "protocol": "协议类型",
 *     "username": "账号",
 *     "password": "密码",
 *     "hostname": "主机域名或IP",
 *     "port": "端口",
 *     "path": "路径地址"
 * }
 * ```
 *
 * 系统会自动计算参数中的 key = value 相关信息
 *
 * @memberOf module:to/zone
 * @param {String} value 需要解析的协议值
 * @param {Number} port 默认端口号
 * @return {string|null} 返回读取的参数值。
 */
const toProtocol = (value = "", port = 0) =>
    __Zn.toProtocol(value, port);
/**
 * ## 「标准」`Ux.toUrl`
 *
 * 将`key=value`追加到url路径中，如
 *
 * ```js
 * // url = /api/params?name=x
 * Ux.toUrl(url, "pass", "111")
 * // url = /api/params?name=x&pass=1111
 * ```
 *
 * 系统会自动计算参数中的 key = value 相关信息
 *
 * @memberOf module:to/zion
 * @param {String} uri 需要读取的查询参数名称。
 * @param {String} key 追加的参数名
 * @param {Any} value 追加的参数值
 * @return {string|null} 返回读取的参数值。
 */
const toUrl = (uri = "", key, value) =>
    __Zi.toUrl(uri, key, value);
/**
 * ## 「引擎」`Ux.isRoute`
 *
 * 连接 `react-router` 中的路由对象执行判断，判断当前界面是否执行了**路由变化**，如果出现变化则返回 true，如果没出现变化则 false。
 * 主要检查路由地址是否发生了变化。
 *
 * Zero Ui对`react-router`执行了数据结构层面的封装，构造了新的TypeScript对象`DataRouter`，并且这个对象贯穿于整个
 * Zero Ui生成`$router`变量，检查时会执行`path()`函数的检查，检查Uri地址是否发生了改变，如果改变则执行**跳转**，如果
 * 没有发生任何改变，则不需要跳转。
 *
 * 代码示例：
 *
 * ```js
 * // 主页 / 动态 / 静态页面切换的 BUG
 if (Ux.isRoute(this.props, prevProps)) {
    const state = Ux.clone(this.state);
    state.$hoc = Fn.fnI18n(target, options);
    state.$op = Fn.fnOp(options);
    this.setState(state);
}
 * ```
 *
 * > 该函数通常用于静态和动态模板中实现顶层的state状态变更。
 *
 * @memberOf module:is/zion
 * @param {Object} props React组件当前属性 props。
 * @param {Object} prevProps React组件的前一个属性 props。
 * @return {boolean} 返回是否发生路由变化的检查值。
 */
const isRoute = (props, prevProps) =>
    __Zi.isRoute(props, prevProps);
/**
 * ## 「引擎」`Ux.isLoaded`
 *
 * @memberOf module:is/zion
 * @param props
 * @param prevProps
 * @returns {*}
 */
const isLoaded = (props, prevProps) =>
    __Zi.isLoaded(props, prevProps);
/**
 * ## 「引擎」`Ux.toPid`
 *
 * 根据 pid 的值计算 defaultOpenKeys 和 defaultSelectedKeys 值。
 *
 * @memberOf module:to/zion
 * @param {Object|ReactComponent} reference React组件引用信息。
 * @param {Array} data 菜单数据信息。
 * @param {Object} state 被修改的状态信息
 */
const toPid = (reference, data = [], state = {}) =>
    __Zi.toPid(reference, data, state);


/**
 * ## 「引擎」`Ux.isLogged`
 *
 * 和 `storeUser` 对应的登录用户数据读取专用方法。
 *
 * 1. 如果已登录，则可以读取用户数据。
 * 2. 如果未登录，则用户数据为空对象。
 *
 * ```js
 * // 读取当前用户登录数据
 * import Ux from 'ux';
 * const user = Ux.isLogged();
 * ```
 *
 * @memberOf module:is/zodiac
 * @return {any} 返回登录的用户数据信息，如果未登录返回 `{}`。
 */
const isLogged = () => __Zo.isLogged();


/**
 * ## 「引擎」`Ux.isInit`
 *
 * 和 `storeApp` 对应的初始化应用数据读取专用方法。
 *
 * ```js
 * // 读取当前应用数据
 * import Ux from 'ux';
 * const app = Ux.isInit();
 * ```
 *
 * @memberOf module:is/zodiac
 * @return {any} 返回当前应用程序数据信息，如果没有则返回 `{}`。
 */
const isInit = () => __Zo.isInit();
/**
 * ## 「引擎」`Ux.isAuthorized`
 *
 * 登录控制专用跳转方法，如果已登录则不执行任何跳转，如果未登录则跳转到登录界面，并且加上当前页面实现`target`计算。
 *
 * @memberOf module:is/zion
 * @param {Object|ReactComponent} reference React组件引用。
 * @return {any} 跳转专用
 */
const isAuthorized = (reference) =>
    __Zi.isAuthorized(reference);

/**
 * ## 「引擎」`Ux.toLogout`
 *
 * 登录注销专用函数，配合当前系统中的信息实现用户**注销**功能。
 *
 * @memberOf module:to/zion
 * @param {Boolean} cleanApp 是否清除应用信息（登录时不清除）
 * @return {any} 返回注销结果。
 */
const toLogout = (cleanApp = true) =>
    __Zi.toLogout(cleanApp);
/**
 * ## 「引擎」`Ux.toOriginal`
 *
 * 带原始参数`target`的核心路由跳转功能，新参数中不包含`key, id, target`，可以和 `toRoute` 配合使用。
 *
 * * target：该值为原始的路由路径，如果有值则直接跳转，用于登录控制过后返回原始页面专用。
 *
 * @memberOf module:to/zion
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {String} switched 传入内容替换掉 Cv.ENTRY_ADMIN
 * @param {Array} exclude 移除参数集
 */
const toOriginal = (reference = {}, switched, exclude = []) =>
    __Zi.toOriginal(reference, switched, exclude);
/**
 * ## 「引擎」`Ux.toPassword`
 *
 * 直接重定向到密码更改页，带参数控制
 * limitation=true
 *
 * @memberOf module:to/zion
 * @param {Object|ReactComponent} reference React组件引用。
 */
const toPassword = (reference = {}) =>
    __Zi.toPassword(reference);
/**
 * ## 「引擎」`Ux.toUnauthorized`
 *
 * @memberOf module:to/zion
 * @param reference
 */
const toUnauthorized = (reference) =>
    __Zi.toUnauthorized(reference);
/**
 * ## 「标准」`Ux.toLoading`
 *
 * 加载效果界面专用的延迟执行方法，主要用于 ajax 和界面效果联通。
 *
 * @memberOf module:to/zone
 * @param {Function} consumer 执行函数
 * @param {Number} seed 加载的时间单位
 */
const toLoading = (consumer, seed) => __Zn.toLoading(consumer, seed);
/**
 * ## 「引擎」`Ux.toAssist`
 *
 * 辅助数据专用函数
 *
 * @memberOf module:to/zodiac
 * @param {Object} inherit 修改对象
 * @param {Object|ReactComponent} reference React组件引用信息。
 * @return {Object} 返回 $a_ 打头以及 __ 打头的辅助函数
 */
const toAssist = (reference, inherit = {}) =>
    __Zo.yoAide(reference, inherit);
/**
 * ## 「引擎」`Ux.isMod`
 *
 * @memberOf module:is/zodiac
 * @param moduleKey
 * @returns {*}
 */
const isMod = (moduleKey) => __Zo.isMod(moduleKey);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 是否登录
    isLogged,
    // 是否初始化应用
    isInit,
    // 模块化
    isMod,
    // 登录控制
    isAuthorized,
    toUnauthorized,
    // 注销
    toLogout,
    // 到原来地址
    toOriginal,
    // 密码修改页
    toPassword,
    // 统一加载设置加载时间
    toLoading,
    // Query String 参数读取
    toQuery,
    toQueryKv, kvQuery: toQueryKv,  // toQueryKv -> kvQuery

    // 路由连接地址
    toRoute,
    // pid = ???, 挂载 pid 部分
    toPid,
    // Url参数追加
    toUrl,
    // 转换成协议对象
    toProtocol,
    // Assist专用数据
    toAssist, yoAide: toAssist,
    // 路由是否变化
    isRoute,    // 路由正在变化
    isLoaded,   // 路由未变化的更新流程
    /**
     * ## 「标准」`Ux.toVis`
     *
     * @memberOf module:to/zion
     * @param view
     * @param position
     * @returns {*}
     */
    toVis: (view, position) => __Zi.toVis(view, position),
    /**
     * ## 「开发」`Ux.devSkipValidate`
     *
     * @memberOf module:dev/zion
     * @returns {Boolean}
     */
    devSkipValidate: () => __Zi.devSkipValidate(), // 关验证
};
