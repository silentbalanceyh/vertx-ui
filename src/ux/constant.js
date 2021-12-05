import Immutable from "immutable";
// --------------------------------------------------------
Object.freeze(process.env);
/*
 * 「循环」防止循环引用，不导入 abyss 包
 */
const ENV = Immutable.fromJS(process.env).toJS();
// eslint-disable-next-line
for (const key in ENV) {
    if (ENV.hasOwnProperty(key)) {
        if (key.startsWith("K_") || key.startsWith("DEV_")) delete ENV[key];                // 移除原始K_和DEV_
        if ("true" === ENV[key] || "false" === ENV[key]) ENV[key] = Boolean(ENV[key]);      // Boolean处理，布尔值
    }
}
const KEY_APP = `${process.env.K_SESSION}SESSION/APP/${process.env.APP.toUpperCase()}`;
const _parseBoolean = (...keys) => {
    let result = "development" === process.env.NODE_ENV;
    keys.forEach(key => result = result && process.env[key] && "true" === process.env[key]);
    return Boolean(result);
}
// ------------------ I.economy.js ---------------------
const ECONOMY = {
    /**
     * ## `Ux.Env.MENU_TYPE`
     *
     * 常用 Web 菜单的类型设置，该类型对应`X_MENU`表中的type字段，菜单类型主要包含下边几种：
     *
     * |代码调用|值|说明|
     * |---:|:---|:---|
     * |`Ux.Env.MENU_TYPE.TOP`|TOP-MENU|顶部菜单|
     * |`Ux.Env.MENU_TYPE.APP`|APP-MENU|主界面Dashboard专用菜单|
     * |`Ux.Env.MENU_TYPE.SIDE`|SIDE-MENU|系统主菜单（左侧边菜单）|
     * |`Ux.Env.MENU_TYPE.NAV`|NAV-MENU|导航栏专用菜单信息|
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     *
     */
    MENU_TYPE: {
        SIDE: "SIDE-MENU",      // 左边菜单
        APP: "APP-MENU",        // 主界面 Dashboard 专用菜单
        NAV: "NAV-MENU",        // 导航栏专用（包含 SIDE-MENU 和 NAV-MENU
        TOP: "TOP-MENU",        // 顶部右上角菜单信息
    },


    /**
     * ## 「业务」`Ux.Env.ECONOMY`
     *
     * 常用 Web 组件的 className属性，该属性应用会牵涉到业务应用。
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
    ECONOMY: {
        CARD_CONTAINER: "web-card",     // PageCard / HelpCard最外层
        TAB_CONTAINER: "web-tab",       // ComplexList / TabList
        ROW_HEAD: "web-row-head",       // 放在头部的间距文件
        TABLE_CONTROL: "web-table",     // 表格组件专用
    },


    /**
     * ## `Ux.Env.SELECTION`
     *
     * 专用树筛选模式，用于执行树中节点的筛选模式，在树结构中经常使用，如`X_CATEGORY`构造菜单等。
     *
     * |模式值|说明|
     * |---:|:---|
     * |`PARENT_ALL_INCLUDE`|选择当前节点和所有父节点集合（包含祖辈）。|
     * |`PARENT_ALL`|除开当前节点，选择所有父节点集合（包含祖辈）。|
     * |`PARENT`|选择直接父节点（不包含祖辈）。|
     * |`CURRENT`|「默认」只选择当前节点。|
     * |`CHILDREN`|直接子节点（不包含孙辈）。|
     * |`CHILDREN_ALL`|选择所有子节点（包含孙辈以及以下）。|
     * |`CHILDREN_ALL_INCLUDE`|选择当前节点和所有子节点（包含孙辈）。|
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
    SELECTION: {
        PARENT_ALL_INCLUDE: "PARENT_ALL_INCLUDE",           // 当前 + 所有父节点
        PARENT_ALL: "PARENT_ALL",                           // 所有父节点
        PARENT: "PARENT",                                   // 直接父节点
        CURRENT: "CURRENT",                                 // 只选择当前节点
        CHILDREN: "CHILDREN",                               // 直接子节点
        CHILDREN_ALL: "CHILDREN_ALL",                        // 所有子节点
        CHILDREN_ALL_INCLUDE: "CHILDREN_ALL_INCLUDE",       // 当前节点 + 所有子节点
    },


    /**
     * ## `Ux.Env.RX_SOURCE`
     *
     * 响应式编程的数据来源模式设置，遗留系统由于redux和react交叉，所以会出现来源混淆的情况。
     *
     * * `REACTIVE`：响应式Rxjs，直接使用Rx模式的数据来源。
     * * `REACT`：只使用 React，通常是state和props相结合。
     * * `REDUX`：配合 Redux 使用的数据来源。
     *
     * @memberOf module:_constant
     * @deprecated
     * @constant
     * @type {Object}
     */
    RX_SOURCE: {
        REACTIVE: "REACTIVE",
        REACT: "REACT",
        REDUX: "REDUX"
    },


    /**
     *  ## `Ux.Env.FORM_MODE`
     *
     *  表单模式设置，目前包含三种常见表单
     *
     *  * ADD：添加表单。
     *  * EDIT：编辑表单。
     *  * SEARCH：搜索表单。
     *
     * 表单模式中会影响核心变量`$inited`，该值为表单初始值，如果是添加模式，不论是否传入，该值都为空，而在编辑模式中，`$inited`几乎是一定有值的。
     * 除开这个意外，还包含另外一个核心变量`$record`，它用于记录父表单，以及某个表格字段中的行值，这个会在特殊组件中专程说明。
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
    FORM_MODE: {
        ADD: "ADD",
        EDIT: "EDIT",
        SEARCH: "SEARCH"
    },


    /**
     * ## `Ux.Env.XT_FORMAT`
     *
     * 自定义组件数据格式信息
     *
     * * OBJECT：Json对象格式
     * * ARRAY：Json数组格式（对象数组）
     * * ARRAY_PURE: 纯数组格式
     *
     * 复杂格式
     *
     * * ARRAY_MAP: 按 Unique 键分组专用格式，值为 Object
     * * ARRAY_GROUP：按某个字段分组专用格式，值为 Array
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
    XT_FORMAT: {
        OBJECT: "OBJECT",
        ARRAY: "ARRAY",
        ARRAY_MAP: "ARRAY_MAP",
        ARRAY_PURE: "ARRAY_PURE",
        ARRAY_GROUP: "ARRAY_GROUP"
    },
};

export default {
    /**
     * ## `Ux.Env.xxx`
     *
     * ```js
     * import Ux from 'ux';
     * const value = Ux.Env.xxx;
     * ```
     *
     * 该常量主要用于环境变量，会包含所有环境变量的基本信息，环境变量基本规则如下：
     *
     * 1. 去掉前缀 `Z_` 的环境变量名称
     * 2. 去掉前缀 `DEV_` 的环境变量名称
     *
     * 详细信息参考常量表格，而且环境变量会直接追加到`Ux.Env`根节点中。
     *
     * @memberOf module:_constant
     * @constant (环境变量)
     */
    ...ENV,
    ...ECONOMY,


    /*
     * ## `Ux.Env.KEY_APP`
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.KEY_APP;
     * ```
     *
     * 多应用环境的当前应用的主键信息，对应后端 `X_APP` 表中的主键数据。
     *
     * @memberOf module:_constant
     * @constant
     * @type {string}
     */
    KEY_APP,


    /**
     * ## `Ux.Env.X_LANG`
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.X_LANG;
     * ```
     *
     * LocalStorage 专用的存储键值，存储当前应用的语言信息，多语言环境专用。
     *
     * @memberOf module:_constant
     * @constant
     * @type {string}
     */
    X_LANG: `${KEY_APP}/LANG`,


    /**
     * ## `Ux.Env.X_APP_ID`
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.X_APP_ID;
     * ```
     *
     * LocalStorage 专用的存储键值（非敏感信息存储）
     *
     * @memberOf module:_constant
     * @constant
     * @type {string}
     */
    X_APP_ID: `${KEY_APP}/ID`,


    /**
     * ## `Ux.Env.X_APP_KEY`
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.X_APP_KEY;
     * ```
     *
     * LocalStorage 专用的存储键值（敏感信息存储）
     *
     * @memberOf module:_constant
     * @constant
     * @type {string}
     */
    X_APP_KEY: `${KEY_APP}/KEY`,


    /**
     * ## `Ux.Env.X_SIGMA`
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.X_SIGMA;
     * ```
     *
     * LocalStorage 专用的存储键值（统一标识专用）
     *
     * @memberOf module:_constant
     * @constant
     * @type {string}
     */
    X_SIGMA: `${KEY_APP}/SIGMA`,


    /**
     * ## `Ux.Env.X_HEADER`
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.X_HEADER;
     * ```
     *
     * X 系列的头部专用信息，用于处理 X 系列的核心头部信息，参考下表
     *
     * |变量值|Http请求头|说明|
     * |---:|:---|:---|
     * |`X_APP_KEY`|X-AppKey|多应用环境处理敏感信息的应用键专用。|
     * |`X_APP_ID`|X-AppId|多应用环境处理普通信息的应用键值专用（带业务）。|
     * |`X_SIGMA`|X-Sigma|平台应用标识符，也称为统一标识符，在多应用环境中用于标识应用（不带业务）。|
     * |`X_LANG`|X-Lang|多语言平台的语言值（头文件识别）。|
     *
     * > 通常情况下，`X_SIGMA`会和租户绑定，实现多租户信息，而`X_APP_ID/X_APP_KEY`会和租户旗下的应用绑定，一个租户多个应用时则使用应用标识符。
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
    X_HEADER: {
        X_APP_KEY: "X-App-Key",
        X_APP_ID: "X-App-Id",
        X_SIGMA: "X-Sigma",
        X_LANG: "X-Lang"
    },


    /**
     * ## `Ux.Env.KEY_USER`
     *
     * SessionStorage 专用的存储键值，存储当前用户登录信息，当用户点击了登录按钮过后，返回的用户登录数据会存储
     * 在该键值中，里面存储的是用户数据的对象，其中最核心的字段如：
     *
     * ```json
     * {
     *     "key": "用户主键（标准）",
     *     "uniqueId": "用户全局唯一键（遗留系统专用）",
     *     "userId": "Spring桥接专用，大部分系统都使用了userId作主键"
     * }
     * ```
     *
     * @memberOf module:_constant
     * @constant
     * @type {string}
     * @default {K_SESSION}SESSION/USER
     */
    KEY_USER: `${process.env.K_SESSION}SESSION/USER`,

    /**
     * ## `Ux.Env.KEY_EVENT`
     *
     * SessionStorage 专用的存储键值，存储 Redux 的事件专用信息，所有执行了 redux 的事件前缀都以环境变量中配置的
     * `Z_K_EVENT`为前缀，不同的应用这个值应该不一致，主要用来实现多应用分流。当前前端中对 redux 的使用主要在整个
     * 状态树的顶层，而兄弟节点的通讯走 redux 而不是走状态。
     *
     * * 本组件内部使用props和state传递数据，包括数据继承。
     * * 跨组件之间传递数据则使用redux，目前最多应用于外层按钮和里层按钮的房重复提交同步操作。
     *
     * @memberOf module:_constant
     * @constant
     * @type {string}
     */
    KEY_EVENT: process.env.K_EVENT,


    /**
     * ## `Ux.Env.ENTRY_LOGIN`
     *
     * 当前站点的登录入口模板，通常也是应用的入口，进入入口过后通过登录可直接跳转到`ENTRY_ADMIN`配置的管理主界面。
     *
     * * 使用`Z_ROUTE`环境变量实现多应用管理，相同应用出现不同的用户时，可设置不同的`Z_ROUTE`。
     * * 默认路径为`/login/index`，为登录之前的入口界面。
     *
     * @memberOf module:_constant
     * @constant
     * @type {string}
     * @default /{Z_ROUTE}/login/index
     */
    ENTRY_LOGIN: `/${process.env.ROUTE}${process.env.ENTRY_LOGIN}`,


    /**
     * ## `Ux.Env.ENTRY_ADMIN`
     *
     * 当前前端应用的主界面路径，主界面路径分为两部分
     *
     * * 使用`Z_ROUTE`环境变量实现多应用管理，相同应用出现不同的用户时，可设置不同的`Z_ROUTE`。
     * * 默认路径为`/main/index`，为登录过后管理主界面。
     *
     * @memberOf module:_constant
     * @constant
     * @type {string}
     * @default /{Z_ROUTE}/main/index
     */
    ENTRY_ADMIN: `/${process.env.ROUTE}${process.env.ENTRY_ADMIN}`,


    /**
     * ## `Ux.Env.HTTP_METHOD`
     *
     * HTTP方法常量，目前支持：`GET, POST, PUT, DELETE`四种，全小写类型
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
    HTTP_METHOD: {
        GET: "get",
        POST: "post",
        PUT: "put",
        DELETE: "delete"
    },


    /**
     * ## `Ux.Env.MIMES`
     *
     * 系统常用的MIME值，用于设置`Accept/Content-Type`等基础媒体类型值。目前系统中的值如下：
     *
     * |代码调用|值|说明|
     * |:---|:---|:---|
     * |`Ux.Env.MIMES.JSON`|application/json|JSON媒体类型|
     * |`Ux.Env.MIMES.MULTIPART`|multipart/form-data|（略）|
     * |`Ux.Env.MIMES.FORM`|application/x-www-form-urlencoded|（略）|
     * |`Ux.Env.MIMES.STREAM`|application/octet-stream|二进制文件类型，上传下载用|
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
    MIMES: {
        JSON: "application/json",
        MULTIPART: "multipart/form-data",
        FORM: "application/x-www-form-urlencoded",
        STREAM: "application/octet-stream"
    },


    /**
     * ## `Ux.Env.HTTP11`
     *
     * HTTP11 中的请求头所有标准协议常量，该常量的命名规则如下：
     *
     * * 将原始请求头全部大写。
     * * 所有的`-`转换成`_`生成对应的键值的。
     *
     * 使用的参考代码如下：
     *
     * ```js
     *
     * // 下载专用头设置，客户端只接受 octet-stream 格式
     * headers.append(Cv.HTTP11.ACCEPT, "application/octet-stream");
     * headers.append(Cv.HTTP11.CONTENT_TYPE, "application/octet-stream");
     * ```
     *
     * 目前版本支持的值列表（所有定义）：
     *
     * ```json
     {
        "ACCEPT": "Accept",
        "ACCEPT_CHARSET": "Accept-Charset",
        "ACCEPT_ENCODING": "Accept-Encoding",
        "ACCEPT_LANGUAGE": "Accept-Language",
        "ACCEPT_RANGES": "Accept-Ranges",
        "AGE": "Age",
        "ALLOW": "Allow",
        "AUTHORIZATION": "Authorization",
        "CACHE_CONTROL": "Cache-Control",
        "CONNECTION": "Connection",
        "CONTENT_BASE": "Content-Base",
        "CONTENT_ENCODING": "Content-Encoding",
        "CONTENT_LENGTH": "Content-Length",
        "CONTENT_LOCATION": "Content-Location",
        "CONTENT_MD5": "Content-MD5",
        "CONTENT_RANGE": "Content-Range",
        "CONTENT_TYPE": "Content-Type",
        "DATE": "Date",
        "ETAG": "ETag",
        "EXPIRES": "Expires",
        "FORM": "Form",
        "HOST": "Host",
        "IF_MODIFIED_SINCE": "If-Modified-Since",
        "IF_MATCH": "If-Match",
        "IF_NONE_MATCH": "If-None-Match",
        "IF_RANGE": "If-Range",
        "IF_UNMODIFIED_SINCE": "If-Unmodified-Since",
        "LAST_MODIFIED": "Last-Modified",
        "LOCATION": "Location",
        "MAX_FORWARDS": "Max-Forwards",
        "PRAGMA": "Pragma",
        "PROXY_AUTHENTICATE": "Proxy-Authenticate",
        "PROXY_AUTHORIZATION": "Proxy-Authorization",
        "PUBLIC": "Public",
        "RANGE": "Range",
        "REFENER": "Refener",
        "RETRY_AFTER": "Retry-After",
        "SERVER": "Server",
        "TRANSFER_ENCODING": "Transfer-Encoding",
        "UPGRADE": "Upgrade",
        "USER_AGENT": "User-Agent",
        "VARY": "Vary",
        "WARNING": "Warning",
        "WWW_AUTHENTICATE": "WWW-Authenticate",
        "XSRF_TOKEN": "X-XSRF-TOKEN"
    }
     * ```
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
    HTTP11: {
        "ACCEPT": "Accept",
        "ACCEPT_CHARSET": "Accept-Charset",
        "ACCEPT_ENCODING": "Accept-Encoding",
        "ACCEPT_LANGUAGE": "Accept-Language",
        "ACCEPT_RANGES": "Accept-Ranges",
        "AGE": "Age",
        "ALLOW": "Allow",
        "AUTHORIZATION": "Authorization",
        "CACHE_CONTROL": "Cache-Control",
        "CONNECTION": "Connection",
        "CONTENT_BASE": "Content-Base",
        "CONTENT_ENCODING": "Content-Encoding",
        "CONTENT_LENGTH": "Content-Length",
        "CONTENT_LOCATION": "Content-Location",
        "CONTENT_MD5": "Content-MD5",
        "CONTENT_RANGE": "Content-Range",
        "CONTENT_TYPE": "Content-Type",
        "DATE": "Date",
        "ETAG": "ETag",
        "EXPIRES": "Expires",
        "FORM": "Form",
        "HOST": "Host",
        "IF_MODIFIED_SINCE": "If-Modified-Since",
        "IF_MATCH": "If-Match",
        "IF_NONE_MATCH": "If-None-Match",
        "IF_RANGE": "If-Range",
        "IF_UNMODIFIED_SINCE": "If-Unmodified-Since",
        "LAST_MODIFIED": "Last-Modified",
        "LOCATION": "Location",
        "MAX_FORWARDS": "Max-Forwards",
        "PRAGMA": "Pragma",
        "PROXY_AUTHENTICATE": "Proxy-Authenticate",
        "PROXY_AUTHORIZATION": "Proxy-Authorization",
        "PUBLIC": "Public",
        "RANGE": "Range",
        "REFENER": "Refener",
        "RETRY_AFTER": "Retry-After",
        "SERVER": "Server",
        "TRANSFER_ENCODING": "Transfer-Encoding",
        "UPGRADE": "Upgrade",
        "USER_AGENT": "User-Agent",
        "VARY": "Vary",
        "WARNING": "Warning",
        "WWW_AUTHENTICATE": "WWW-Authenticate",
        "XSRF_TOKEN": "X-XSRF-TOKEN"
    },


    /**
     * ## `Ux.Env.FORBIDDEN`
     *
     * 在ACL的权限控制中，表单数据分为三态：
     *
     * * 可编辑
     * * 只读
     * * 有数据不可查看：如果有数据不可查看，则会显示成 FORBIDDEN 设置的值。
     *
     * 这个变量只会在ACL权限控制中使用，其他地方不可使用，该变量会隐藏真实数据而导致数据本身不可查看。
     *
     * > 通常意义上，显示成********的数据是不可编辑的，因为编辑会带来副作用，所以表单从原始的四态变成了三态。
     *
     * 表单的状态表格如下：
     *
     * |维度|有权限|无权限|
     * |---:|---|---|
     * |可编辑|编辑数据|x（不支持）|
     * |只读|显示数据|********|
     *
     * @memberOf module:_constant
     * @constant
     * @type {string}
     * @default "********"
     */
    FORBIDDEN: "********",


    /**
     * ## `Ux.Env.DEBUG`
     *
     * 该变量检测当前环境是否开启了`调试环境`，开启调试环境的条件：
     *
     * * `process.env.NODE_ENV`的值为 development。
     * * `process.env.DEV_DEBUG`的值为 true，对应环境变量`Z_DEV_DEBUG`的值，启动时转换。
     *
     * ```js
     * // 直接调用 Ux 执行判断
     *
     * // 「内部」
     * import Cv from './constant';
     * if(Cv.DEBUG){
     *     // 内部，研发模式代码
     * }
     *
     * // 「外部」
     * import Ux from 'ux';
     * if(Ux.Env.DEBUG){
     *     // 外部，开发模式代码
     * }
     * ```
     *
     * @memberOf module:_constant
     * @constant
     * @type {boolean}
     * @default false
     */
    DEBUG: _parseBoolean("DEV_DEBUG"),


    /**
     * ## 「开发专用」`Ux.Env.MOCK`
     *
     * 是否开启 mock 模拟数据环境，开始纯前端开发模式。
     *
     * * `process.env.NODE_ENV`的值为 development。
     * * `process.env.DEV_MOCK`的值为 true，对应环境变量`Z_DEV_MOCK`的值，启动时转换。
     *
     * ### 1.Mock规则
     *
     * mock环境存储在`src/mock`目录中，并且包含模拟环境的生成规则，构造 mockKey 的规则如下：
     *
     * 1. 基本键值对应：`HTTP方法 + 下划线 + URI路径（ / 转换成 _ ）`。
     * 2. URI路径除了基本规则以外，`:id`和`:key`可直接被还原，如`/api/user/:key`的真实访问路径为`/api/user/xxxxxxxxxx`，则可被还原成`_api_user_:key`作为mockKey来使用。
     *
     * ### 2.Mock入口文件
     *
     * mock入口文件如下：
     *
     * ```js
     * export default {
     *      // -------------------------------------------------- 全局
     *      post_Login_user_login: 登录主接口,
     *      post_api_user_logout: 注销主接口,
     *      "post_Login_user_get-app-list": 读取主页菜单,
     *      "post_Login_user_get-menu-list": 读取所有菜单,
     *      get_api_tenant: 读取租户列表,
     *
     *      // ......
     * }
     * ```
     *
     * ### 3.Mock数据结构
     *
     * mock文件内部的数据结构如下：
     *
     * ```js
     * export default {
     *      mock: true,
     *      processor: (
     *          data = {},      // 「响应」对应 data 节点的数据，可以Object也可以Array
     *          params          // 「请求」对应当前请求数据
     *      ) => {
     *          // 返回 Promise
     *      },
     *      data: [
     *      ]
     * }
     * ```
     *
     * |参数|类型|说明|
     * |---:|:---|:---|
     * |mock|boolean|是否单独开关当前mock环境，只有mock打开才生效，如果设置false，则请求不走Mock流程。|
     * |data|Object/Array|模拟数据类型，可模拟成想要的数据类型做纯前端开发。|
     * |processor|Function|函数类型，可以在data基础之上实现响应数据格式的初步转换。|
     *
     * @memberOf module:_constant
     * @constant
     * @type {boolean}
     * @default false
     */
    MOCK: _parseBoolean("DEV_MOCK"),


    /**
     * ## 「开发专用」`Ux.Env.DEBUG_FORM`
     *
     * 是否开启表单生命周期监控流程，监控表单渲染的专用生命周期。
     *
     * * `process.env.NODE_ENV`的值为 development。
     * * `process.env.DEV_FORM`的值为 true，对应环境变量`Z_DEV_FORM`的值，启动时转换。
     *
     * 该变量用于控制开发环境中表单监控。
     *
     * @memberOf module:_constant
     * @constant
     * @type {boolean}
     * @default false
     */
    DEBUG_FORM: _parseBoolean("DEV_FORM"),


    /**
     * ## 「开发专用」`Ux.Env.DEBUG_AJAX`
     *
     * 是否开启Ajax的请求数据捕捉监控流程。
     *
     * * `process.env.NODE_ENV`的值为 development。
     * * `process.env.DEV_MOCK`的值为 true，对应环境变量`Z_DEV_MOCK`的值，启动时转换。
     * * `process.env.DEV_AJAX`的值为 true，对应环境变量`Z_DEV_AJAX`的值。
     *
     * 上述三个条件同时满足时才执行Ajax的监控条件，启用过后，系统会调用`saveAs`将请求数据存储成json文件。
     *
     * @memberOf module:_constant
     * @constant
     * @type {boolean}
     * @default false
     */
    DEBUG_AJAX: _parseBoolean("DEV_MOCK", "DEV_AJAX"),


    /**
     * ## 「开发专用」`Ux.Env.MONITOR`
     *
     * 是否开启前端界面监控环境工具，该变量牵涉变量执行工具，在最老的版本中辅助调试专用
     *
     * * 可用于监控props中的变量变化信息。
     * * 可用于监控state中的变量变化信息。
     *
     * @memberOf module:_constant
     * @constant
     * @type {boolean}
     * @default false
     */
    MONITOR: _parseBoolean("DEV_DEBUG", "DEV_MONITOR"),
    // 存储 MONITOR 数据
    KEY_MDATA: `${process.env.K_SESSION}MONITOR/DATA/`,
    /**
     * ## `Ux.Env.SIGN`
     *
     * 是否开启 RESTful 的数字签名功能，如果开启了数字签名功能，则会在RESTful接口中直接启用数字签名，追加`sig`参数
     * `sig`的计算规则如下：
     *
     * 1. 先在系统中执行基础路径计算。
     * 2. 如果用户已经登录，则使用登录用户的账号 key 执行计算，未登录则使用时间戳。
     * 3. 然后解析所有的参数。
     *      1. 如果是 pager 参数，则使用`":index" + pager.index + "size" + pager.size`。
     *      2. 如果是 criterias 参数，则执行排序后追加参数
     * 4. 最后执行 `HMAC-512` 基础算法加密，带上超时的 10 分钟。
     *
     * > 目前大部分应用并没使用数字签名功能，但后期可以考虑直接引入数字签名加强安全性。
     *
     * @memberOf module:_constant
     * @constant
     * @type {boolean}
     * @default false
     */
    SIGN: "true" === process.env.Z_SIGN
}