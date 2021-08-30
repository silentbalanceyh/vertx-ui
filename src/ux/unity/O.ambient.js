// 导入当前目录
import Store from './O.store';
import Encrypt from "./O.encrypt";
// 导入外层
import Cv from '../constant';
import Ele from "../element";
import Abs from '../abyss';
import E from "../error";

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
 *
 * 特殊点需要说明：特殊参数 target 会在读取过程中进行判断：
 *
 * 1. 如果 target = x 的 x 中包含了 '/'，则表示当前的target不需要执行Base64的decoding操作。
 * 2. 在 '/' 之外，target参数会被Base64算法执行解码操作，还原原始的链接信息。
 * ```
 *
 * @memberOf module:_to
 * @param {String} name 需要读取的查询参数名称。
 * @return {string|null} 返回读取的参数值。
 */
const toQuery = (name = "") => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    let result = null;
    if (r != null) {
        result = unescape(r[2]);
    }
    if (result && "target" === name) {
        if (0 > result.toString().indexOf("/")) {
            /*
             * 不包含 / 符合的时候做 Decrypt，兼容旧系统
             * 特殊参数处理
             */
            result = Encrypt.decryptBase64(result);
        }
    }
    return result;
};

const toRouteParameters = (name = "", params = {}) => {
    if (params) {
        if (params[name]) {
            /*
             * params中传入了 name 参数，而且 name 参数有值
             */
            return params[name];
        } else {
            if (null === params[name]) {
                // params中的 params[name] = null（清空模式）
            } else {
                const queryValue = toQuery(name);
                if (queryValue && "undefined" !== queryValue) {
                    /*
                     * 从 Uri 路径中读取到了参数信息 name = ?
                     */
                    return queryValue;
                }
            }
        }
    } else {
        const queryValue = toQuery(name);
        if (queryValue && "undefined" !== queryValue) {
            /*
             * 从 Uri 路径中读取到了参数信息 name = ?
             */
            return queryValue;
        }
    }
}
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
 * @memberOf module:_to
 * @param {ReactComponent} reference React组件引用。
 * @param {String} uri 跳转路由信息，会追加`CV["ROUTE"]`的前缀执行跳转。
 * @param {Object} params 当前路由所需参数信息
 */
const toRoute = (reference = {}, uri = "", params) => {
    E.fxTerminal(!uri, 10072, uri);
    E.fxTerminal(!reference.hasOwnProperty("props") || !reference.props.hasOwnProperty("$router"),
        10004, reference);
    const $parameters = {};
    /*
     * 1. uri 核心判断
     *      - basePart：路径中 ? 之前的部分
     *      - queryPart：路径中 ? 之后的部分
     */
    let basePart;
    let queryPart;
    if (0 <= uri.indexOf("?")) {
        basePart = uri.split("?")[0];
        queryPart = uri.split("?")[1];
    } else {
        basePart = uri;
        queryPart = null;
    }
    /*
     * 2. 将 queryPart 解析成 queryMap, queryMap 和 params 作为输入参数合并后的结果 inputParams
     */
    const queryMap = _toQPart(queryPart);
    Object.assign($parameters, queryMap, params ? params : {});
    /*
     * 3. 计算 inputParams 中的内部逻辑（mid, pid, target）
     */
    const mid = toRouteParameters("mid", params);
    const pid = toRouteParameters("pid", params);
    if (mid) $parameters.mid = mid;
    if (pid) $parameters.pid = pid;
    if ($parameters.target) {
        $parameters.target = Encrypt.encryptBase64($parameters.target);
    }
    /*
     * 4. 计算 basePart
     */
    let normalizedUri;
    if (basePart.startsWith(`/${Cv['ROUTE']}`)) {
        normalizedUri = basePart;
    } else {
        normalizedUri = `/${Cv['ROUTE']}${basePart}`;
    }
    /*
     * 5. 构造最终的路由地址，并执行跳转
     */
    const normalized = _toQNormalize(normalizedUri, $parameters);
    const {$router} = reference.props;
    $router.to(normalized);
};
const _toQPart = (queryPart) => {
    const queryMap = {};
    if (queryPart) {
        /*
         * queryPart格式：p1=v1&&p2=v2
         */
        const queryArr = queryPart.split("&");
        queryArr.map(literal => literal.replace(/ /g, ''))
            .filter(literal => "" !== literal)
            .forEach(literal => {
                const kv = literal.split('=');
                if (2 === kv.length) {
                    const key = kv[0];
                    const value = kv[1];
                    if (key && value) {
                        queryMap[key] = value;
                    }
                }
            });
    }
    return queryMap;
}
const _toQNormalize = (normalizedUri, $parameters = {}) => {
    let calculated = "";
    if (0 <= Object.keys($parameters).length) {
        calculated += "?";
        const paramQueue = [];
        Object.keys($parameters)
            /*
             * 所有不合法的值中，只过滤 null 和 undefined
             * 保留值：false, "", 0
             */
            .filter(field => null !== $parameters[field])
            .filter(field => undefined !== $parameters[field])
            .forEach(paramName => paramQueue.push(`${paramName}=${$parameters[paramName]}`));
        calculated += paramQueue.join('&');
    }
    return normalizedUri + calculated;
}
const toUrl = (uri = "", key, value) => {
    /*
     * 1. uri 核心判断
     *      - basePart：路径中 ? 之前的部分
     *      - queryPart：路径中 ? 之后的部分
     */
    let basePart;
    let queryPart;
    if (0 <= uri.indexOf("?")) {
        basePart = uri.split("?")[0];
        queryPart = uri.split("?")[1];
    } else {
        basePart = uri;
        queryPart = null;
    }
    const queryMap = _toQPart(queryPart);
    if (key && value) {
        queryMap[key] = value;
    }
    return _toQNormalize(basePart, queryMap);
}
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
 * 主页 / 动态 / 静态页面切换的 BUG
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
 * @memberOf module:_is
 * @param {Props} props React组件当前属性 props。
 * @param {Props} prevProps React组件的前一个属性 props。
 * @return {boolean} 返回是否发生路由变化的检查值。
 */
const isRoute = (props, prevProps) => {
    const $router = props['$router'];
    const $prevRouter = prevProps['$router'];
    if ($router && $prevRouter) {
        return $router.path() !== $prevRouter.path();
    } else return false;     // 防止没有调用 Ex.yoAmbient 检查的情况
};

/**
 * ## 「引擎」`Ux.toPid`
 *
 * 根据 pid 的值计算 defaultOpenKeys 和 defaultSelectedKeys 值。
 *
 * @memberOf module:_to
 * @param {ReactComponent} reference React组件引用信息。
 * @param {Array} data 菜单数据信息。
 * @param {Object} state 被修改的状态信息
 */
const toPid = (reference, data = [], state = {}) => {
    const page = toQuery("pid");
    if (page) {
        const branch = Ele.elementBranch(data, page, 'parentId');
        if (Abs.isArray(branch)) {
            const keySet = new Set(branch.map(item => item.key));
            keySet.delete(page);

            const $keySet = {};
            $keySet.defaultOpenKeys = Array.from(keySet);
            $keySet.defaultSelectedKeys = [page];
            state.$keySet = $keySet;
        }
    }
}


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
 * @memberOf module:_is
 * @return {any} 返回登录的用户数据信息，如果未登录返回 `{}`。
 */
const isLogged = () => {
    const key = Cv.KEY_USER;
    let userData = Store.Session.get(key);
    if (!userData) userData = {};
    return userData;
};


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
 * @memberOf module:_is
 * @return {any} 返回当前应用程序数据信息，如果没有则返回 `{}`。
 */
const isInit = () => {
    const key = Cv.KEY_APP;
    let appData = Store.Storage.get(key);
    if (!appData) appData = {};
    return appData;
};

/**
 * ## 「引擎」`Ux.isAuthorized`
 *
 * 登录控制专用跳转方法，如果已登录则不执行任何跳转，如果未登录则跳转到登录界面，并且加上当前页面实现`target`计算。
 *
 * @memberOf module:_is
 * @param {ReactComponent} reference React组件引用。
 * @return {any} 跳转专用
 */
const isAuthorized = (reference) => {
    if (0 === Object.keys(isLogged()).length) {
        toUnauthorized(reference);
    }
};

/**
 * ## 「引擎」`Ux.toLogout`
 *
 * 登录注销专用函数，配合当前系统中的信息实现用户**注销**功能。
 *
 * @memberOf module:_to
 * @param {Boolean} cleanApp 是否清除应用信息（登录时不清除）
 * @return {any} 返回注销结果。
 */
const toLogout = (cleanApp = true) => {
    /* 注销用户 */
    const key = Cv.KEY_USER;
    const result = Store.Session.remove(key);
    if (cleanApp) {
        /* 删除 appKey */
        Store.Storage.remove(Cv.X_APP_KEY);
        const app = Store.Session.get(Cv.KEY_APP);
        if (app && app['appKey']) {
            delete app['appKey'];
            Store.Storage.put(Cv.KEY_APP, app);
        }
    }
    return result;
};
/**
 * ## 「引擎」`Ux.toOriginal`
 *
 * 带原始参数`target`的核心路由跳转功能，新参数中不包含`key, id, target`，可以和 `toRoute` 配合使用。
 *
 * * target：该值为原始的路由路径，如果有值则直接跳转，用于登录控制过后返回原始页面专用。
 *
 * @memberOf module:_to
 * @param {ReactComponent} reference React组件引用。
 * @param {String} switched 传入内容替换掉 Cv.ENTRY_ADMIN
 */
const toOriginal = (reference = {}, switched) => {
    const original = toQuery("target");
    if (original) {
        const {$router} = reference.props;
        const params = Abs.clone($router.params());
        if (params.key) delete params.key;
        if (params.id) delete params.id;
        if (params.target) delete params.target;
        toRoute(reference, original, params);
    } else {
        /*
         * ROUTE：直接管理界面 /main/index 部分
         * 目标页面 = Cv.ENTRY_ADMIN
         */
        const uri = switched ? switched : Cv.ENTRY_ADMIN;
        toRoute(reference, uri);
    }
};
/**
 * ## 「引擎」`Ux.toPassword`
 *
 * 直接重定向到密码更改页，带参数控制
 * limitation=true
 *
 * @memberOf module:_to
 * @param {ReactComponent} reference React组件引用。
 */
const toPassword = (reference = {}) => {
    /*
     * uri 地址构造
     */
    const uri = "/personal/secure"
    toRoute(reference, uri);
}
const toUnauthorized = (reference) => {
    const {$router} = reference.props;
    const path = $router.path();
    if (path) {
        /*
         * target执行计算，target为登录过后的目标的页面
         * 1）target执行 Base64 加密
         * 2）target在解析的时候会执行解码过程
         */
        toRoute(reference, Cv.ENTRY_LOGIN, {target: path});
    } else {
        toRoute(reference, Cv.ENTRY_LOGIN);
    }
}
/**
 * ## 「标准」`Ux.toLoading`
 *
 * 加载效果界面专用的延迟执行方法，主要用于 ajax 和界面效果联通。
 *
 * @memberOf module:_to
 * @param {Function} consumer 执行函数
 * @param {Number} seed 加载的时间单位
 */
const toLoading = (consumer, seed) => {
    /*
     * 改成 1 ms 毫秒级（略微加载效果）
     * 5 倍距离
     */
    const ms = Ele.valueInt(Cv['LOADING'], 5);
    const loadingMs = seed ? seed : ms;
    setTimeout(consumer, ms * loadingMs);
};
/**
 * ## 「引擎」`Ux.toAssist`
 *
 * 辅助数据专用函数
 *
 * @memberOf module:_to
 * @param {Object} inherit 修改对象
 * @param {ReactComponent} reference React组件引用信息。
 * @return {Object} 返回 $a_ 打头以及 __ 打头的辅助函数
 */
const toAssist = (reference, inherit = {}) => {
    const _seekAssist = (uniform = {}, input = {}) => {
        /*
         * props
         */
        if (input) {
            Object.keys(input)
                .filter(field =>
                    field.startsWith(`$a_`) ||  // 旧辅助数据
                    field.startsWith(`__`) ||   // 新组件继承
                    field.startsWith(`$t_`))    // 古老字典数据
                .forEach(key => uniform[key] = input[key]);
        }
    };
    _seekAssist(inherit, reference.props);
    _seekAssist(inherit, reference.state ? reference.state : {});
    return inherit;
}
export default {
    // 是否登录
    isLogged,
    // 是否初始化应用
    isInit,
    // 登录控制
    isAuthorized,
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
    // 路由连接地址
    toRoute,
    // pid = ???, 挂载 pid 部分
    toPid,
    // Url参数追加
    toUrl,
    // Assist专用数据
    toAssist,
    // 路由是否变化
    isRoute,
};
