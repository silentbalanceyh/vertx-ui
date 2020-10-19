import Encrypt from "./O.encrypt";
import E from "../error";
import Value from "../element";
import Abs from "../abyss";
import Cv from '../constant';

/**
 * 标准函数
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
                if (queryValue) {
                    /*
                     * 从 Uri 路径中读取到了参数信息 name = ?
                     */
                    return queryValue;
                }
            }
        }
    } else {
        const queryValue = toQuery(name);
        if (queryValue) {
            /*
             * 从 Uri 路径中读取到了参数信息 name = ?
             */
            return queryValue;
        }
    }
}
/**
 * ## 标准函数
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
    let calculated = "";
    if (0 <= Object.keys($parameters).length) {
        calculated += "?";
        const paramQueue = [];
        Object.keys($parameters)
            .forEach(paramName => paramQueue.push(`${paramName}=${$parameters[paramName]}`));
        calculated += paramQueue.join('&');
    }
    const normalized = normalizedUri + calculated;
    const {$router} = reference.props;
    $router.to(normalized);
};

/**
 * ## 特殊函数「Zero」
 *
 * 连接 `react-router` 中的路由对象执行判断，判断当前界面是否执行了**路由变化**，如果出现变化则返回 true，如果没出现变化则 false。
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
const toPid = (reference, data = [], state = {}) => {
    const page = toQuery("pid");
    if (page) {
        const branch = Value.elementBranch(data, page, 'parentId');
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
export default {
    // Query String 参数读取
    toQuery,
    // 路由连接地址
    toRoute,
    // pid = ???, 挂载 pid 部分
    toPid,
    // 路由是否变化
    isRoute,
}