import Ux from "ux";
import Fn from "./functions";
// =====================================================
// 森林算法
// =====================================================
const calcAddon = (item = {}) => {
    const {metadata = {}, ...rest} = item;
    const {selectable = true, checkable = true} = metadata;
    const result = {...rest, checkable, selectable};
    if (!selectable) {
        result.className = "ux-unselect"
    }
    return result;
}
const calcTree = (categories = [], group = {}, mode) => {
    const normalized = [];
    categories.forEach(category => {
        const {__connect, ...rest} = category;
        if (__connect && group[__connect.tree]) {
            let groupData = group[__connect.tree];
            if (Ux.isArray(groupData)) {
                // 读取连接子节点
                let filtered = groupData.filter(item => {
                    if (__connect.code) {
                        return __connect.code === item.code;
                    } else return true;
                });
                // 拷贝即将添加的数据
                const $filtered = Ux.clone(filtered);
                if ("REPLACE" === mode) {
                    // 不追加当前节点
                    if (category.parentId) {
                        $filtered.forEach(node => node.parentId = category.parentId);
                    }
                } else {
                    // 添加当前节点
                    normalized.push(calcAddon(rest));
                    // 不替换当前节点，直接作为当前节点的子节点
                    $filtered.forEach(node => node.parentId = category.key);
                }
                // 添加每一个节点
                const tree = calcTree($filtered, group, mode);
                if (Ux.isArray(tree) && 0 < tree.length) {
                    tree.forEach(node => {
                        // 连接节点信息
                        normalized.push(calcAddon(node));
                        // 连接子树节点
                        const children = Ux.elementChildren(groupData, node, "parentId");
                        if (Ux.isArray(children) && 0 < children.length) {
                            children.forEach(child => normalized.push(calcAddon(child)));
                        }
                    });
                }
            }
        } else {
            /*
             * 不连接的正常数据
             */
            normalized.push(Ux.clone(rest));
        }
    });
    return normalized;
}

// =====================================================
// Datum字典接口
// =====================================================
const _assist = (uris = {}) => (params) => {
    if (params) {
        /* 如果 params 为 string，则读取树信息 */
        if (Ux.isArray(params)) {
            return Ux.ajaxPost(uris.types, params);
        } else {
            if (params.type) {
                if (params.code) {
                    return Ux.ajaxGet(uris.code, params);
                } else {
                    return Ux.ajaxGet(uris.type, params);
                }
            } else {
                if (params.identifier) {
                    return Ux.ajaxGet(uris.code, {
                        type: uris.category,           // 默认系统顶级类型
                        code: params.identifier
                    })
                } else {
                    return Fn.E.error009();
                }
            }
        }
    } else {
        /* 拒绝调用，参数不全 */
        return Fn.E.error009();
    }
};

const _tabular = _assist({
    code: "/api/:type/tabular/:code",
    type: "/api/type/tabulars/:type",
    types: "/api/types/tabulars",
    category: Fn.V.TYPE_TABULAR
});

const _category = _assist({
    code: "/api/:type/category/:code",
    type: "/api/type/categories/:type",
    types: "/api/types/categories",
    category: Fn.V.TYPE_CATEGORY
});

// =====================================================
// application 应用接口
// =====================================================
const _application = () => {
    /* 读取应用程序 */
    const appData = Ux.isInit();
    if (appData) {
        /* 已经初始化过一次 */
        if (appData['appKey']) {
            /* 二次初始化完成后 */
            return Ux.promise(appData);
        } else {
            /* 直接调用接口 */
            return Ux.ajaxGet("/api/app");
        }
    } else {
        /* 拒绝调用，应用程序未初始化 */
        return Fn.E.error001();
    }
};

const _menus = () => {
    const appData = Ux.isInit();
    if (appData && appData.key) {
        return Ux.ajaxGet("/api/menus");
    } else {
        /* 拒绝调用，应用程序未初始化 */
        return Fn.E.error001();
    }
};

/**
 * ## Ajax接口类
 *
 * 调用方式：
 *
 * ```js
 * import Ex from 'ex';
 *
 * Ex.I.application().then(response => {
 *
 * })
 * ```
 *
 * 安全接口带Token，非安全接口不带Token，统一调用 Zero Extension中的特殊接口。
 *
 * ### 1. 接口列表
 *
 * |函数名|HTTP方法|路径|安全|说明|
 * |:---|---|:---|---|:---|
 * |action|POST|`/api/form/actions`|是|读取表单中的Action专用方法。|
 * |apis|POST|`/api/x-api/search`|是|查询引擎查询`I_API`表结构中的信息。|
 * |app|GET|`/api/name/:name`|否|读取`X_APP`中的可公开部分信息。|
 * |application|GET|`/api/app`|是|「可读取敏感信息」读取应用程序的基本数据，和`app`方法对应。|
 * |attributes|GET|`/api/model/identifier/:identifier`|是|读取模型中的属性集。|
 * |authorize|POST|`/oauth/authorize`|否|OAuth认证流程中申请临时授权码的专用方法。|
 * |category|GET|`/api/:type/category/:code`|是|读取唯一分类记录。|
 * ||GET|`/api/type/categories/:type`|是|读取某一类分类记录。|
 * ||POST|`/api/types/categories`|是|读取多类分类数据记录。|
 * |company|GET|`/api/company/employee/:eid`|是|根据员工ID读取员工所属公司信息。|
 * |control|POST|`/api/ui/control`|是|读取界面控件配置信息`UI_CONTROL`。|
 * |forest|GET|无|是|没有直接对应的API信息，该方法读取`X_CATEGORY`并构造多叉树。|
 * |form|GET|`/api/ui/form/:code`|是|根据表单编码读取单表单记录`UI_FORM`。|
 * |forms|GET|`/api/ui/forms/:identifier`|是|根据模型统一标识符，读取和模型相关的所有表单记录。|
 * |inited|GET|`/api/app`和`/api/menus`|是|应用程序配置的完整初始化流程，登录后读取。|
 * |jobResume|PUT|`/api/job/resume/:key`|是|恢复任务。|
 * |jobs|GET|`/api/job/info/by/sigma`|是|按sigma读取所有的任务定义信息。|
 * |jobStart|PUT|`/api/job/start/:key`|是|启动任务。|
 * |jobStop|PUT|`/api/job/stop/:key`|是|停止任务。|
 * |lists|GET|`/api/ui/lists/:identifier`|是|按identifier读取所有列表配置信息。|
 * |login|POST|`/oauth/login`|否|登录专用接口，用于读取`client_secret`和`client_id`专用方法。|
 * |logout|POST|`/api/user/logout`|是|注销专用接口。|
 * |menus|GET|`/api/menus`|是|读取应用相关的配置信息。|
 * |mission|GET|`/api/job/info/mission/:key`|是|读取任务的详细信息（包括任务状态、运行状态等）。|
 * |module|GET|`/api/module?entry={entry}`|是|根据入口信息读取模块配置数据，对应后端`X_MODULE`表。|
 * |ops|POST|`/api/ui/ops`|是|读取`UI_OP`配置信息，可动态读取，也可静态读取。|
 * |page|POST|`/api/ui/page`|是|读取当前页面配置信息。|
 * |password|POST|`/api/user/password`|是|更新登录账号密码专用接口。|
 * |profile|POST|`/api/user/profile`|是|更新当前登录账号的Profile信息。|
 * |relation|GET|`/api/relation`|是|读取关系定义专用接口。|
 * |relationDelete|POST|`/api/ox/relation/delete`|是|删除关系专用方法。|
 * |relationSave|POST|`/api/ox/relation/save`|是|保存关系专用方法。|
 * |tabular|GET|`/api/:type/tabular/:code`|是|读取唯一字典记录。|
 * ||GET|`/api/type/tabulars/:type`|是|读取某一类字典记录。|
 * ||POST|`/api/types/tabulars`|是|读取多类字典数据记录。|
 * |todo|PUT|`/api/todo/confirm/:key`|是|确认待办。|
 * ||PUT|`/api/todo/reject/:key`|是|拒绝待办。|
 * |token|POST|`/oauth/token`|否|使用授权码交换令牌专用方法。|
 * |uri|GET|`/api/x-api/:key`|是|读取Uri配置信息。|
 * |user|GET|`/api/user`|是|读取当前登录用户基本信息。|
 *
 * ### 2. 特定说明
 *
 * * `/api/ox/relation/save`：保存关系专用方法（CMDB专用）。
 * * `/api/ox/relation/delete`：删除关系专用方法（CMDB专用）。
 *
 * @class I
 */
class I {
    /**
     * ## 「接口」`Ex.I.attributes`
     *
     * 读取单个模型的属性信息
     *
     * * 接口：`/api/model/identifier/:identifier`（GET）
     * * 安全：是
     *
     * 根据模型中的统一标识符`identifier`读取模型中的属性集
     *
     * @async
     * @param {String} identifier 模型标识符
     * @returns {Promise<T>} 返回Promise。
     */
    static attributes(identifier) {
        return Ux.ajaxGet(`/api/model/identifier/:identifier`, {
            identifier,
        }).then((response = {}) => {
            const {attributes = []} = response;
            const processed = [];
            attributes.forEach(attribute => {
                const each = {};
                each.key = attribute.name;
                each.name = attribute.alias + "（" + attribute.name + "）";
                each.data = Ux.clone(attribute);
                processed.push(each);
            });
            return Ux.promise(processed);
        });
    }

    /**
     * ## 「接口」`Ex.I.app`
     *
     * * 接口：`/app/name/:name`（GET）
     * * 安全：否
     *
     * 此接口一般用于初始化过程，调用`Ux.ajaxFetch`函数从远程读取应用程序配置，而且这个接口不带安全认证，也无法
     * 读取到`appKey`这种敏感信息。该函数可传一个Function的异常回调函数，当访问过程中出错时，执行该函数处理异常流程。
     *
     * > 参数中的`:name`参数直接从`Ux.Env.APP`中读取，该值配置在环境变量中。
     *
     * @async
     * @param {Function} failure 容错专用函数。
     * @returns {Promise<T>} 返回Promise。
     */
    static app(failure) {
        return Ux.ajaxFetch("/app/name/:name", {name: Ux['Env']['APP']})
            .catch(error => Ux.isFunction(failure) ? failure(error) : false);
    }

    /**
     * ## 「接口」`Ex.I.application`
     *
     * * 接口：`/api/app`（GET）
     * * 安全：是
     *
     * 带缓存地读取应用程序信息，这个方法会执行校验：
     *
     * 1. 系统调用`Ux.isInit()`方法读取应用信息，如果应用信息不存在则直接抛出异常。
     * 2. 如果拥有应用信息，并且该应用包含了`appKey`数据，则直接从缓存中读取数据。
     * 3. 如果没有包含`appKey`，则只证明执行了第一次初始化，需要再次读取（敏感信息）。
     *
     * > `appKey`是用来判断首次初始化和二次初始化的核心字段，而且该接口会使用appKey读取应用配置数据。
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static application() {
        return _application();
    }

    /**
     * ## 「接口」`Ex.I.menus`
     *
     * * 接口：`/api/menus`（GET）
     * * 安全：是
     *
     * 登录过后根据`Ux.isInit()`的应用信息返回当前应用的所有菜单数据，应用数据存储在
     * `X_APP`表中，包含`X_SOURCE`的数据源信息，菜单数据存储在`X_MENU`表中。
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static menus() {
        return _menus();
    }

    /**
     * ## 「接口」`Ex.I.module`
     *
     * * 接口：`/api/module?entry={entry}`（GET）
     * * 安全：是
     *
     * 根据当前路由路径读取`X_MODULE`中的模块配置信息，该模块的配置信息和`Cab.json`中绑定
     * 的资源文件合并生成当前模块的所有配置信息。
     *
     * @async
     * @param {String} uri 当前模块的入口信息。
     * @returns {Promise<T>} 返回Promise。
     */
    static module(uri = "") {
        /*
         * encodeURI 方法执行 encoding URI的编码动作
         */
        const entry = encodeURI(uri);
        return Ux.ajaxGet('/api/module', {entry});
    }

    /**
     * ## 「接口」`Ex.I.inited`
     *
     * * 接口
     *      * 应用接口：`/api/app`（GET）
     *      * 菜单数据：`/api/menus`（GET）
     * * 安全：是
     *
     * 该接口为登录过后的主页调用的专用初始化接口，主要执行两个操作：
     *
     * 1. 执行 `X_APP` 的全配置信息（包括敏感信息，appKey）。
     * 2. 执行 `X_MENU` 的全配置信息（只读取当前菜单）。
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static inited() {
        return Ux.parallel([
            _application(), // 应用程序
            _menus()        // 菜单
        ]);
    }

    /**
     * ## 「接口」`Ex.I.login`
     *
     * * 接口：`/oauth/login`（POST）
     * * 安全：否
     *
     * 登录入口专用，请求数据如：
     *
     * ```json
     * {
     *     "username": "登录账号",
     *     "password": "MD5加密过后的密码"
     * }
     * ```
     *
     * @async
     * @param {Object} request 登录专用请求。
     * @param {Object} options 选项处理
     * @returns {Promise<T>} 返回Promise。
     */
    static login(request = {}, options = {}) {
        return Ux.ajaxPush('/oauth/login', {
            ...request,
            password: Ux.encryptMD5(request.password)    // MD5加密
        }, options);
    }

    /**
     * ## 「接口」`Ex.I.authorize`
     *
     * * 接口：`/oauth/authorize`（POST）
     * * 安全：否
     *
     * 申请临时码专用方法：
     *
     * ```json
     * {
     *     "client_id": "客户ID",
     *     "client_secret": "客户账号颁布的密钥",
     *     "response_type": "code",
     *     "scope": "应用的域"
     * }
     * ```
     *
     * ### 内部参数
     *
     * |参数名|含义|
     * |:---|:---|
     * |`client_id`|客户端ID，对单个用户而言就是`S_USER`表中的用户主键。|
     * |`client_secret`|创建用户账号（或第三方对接应用）时，平台会发放专用密钥（一个随机字符串）。|
     * |`response_type`|默认值`code`表示授权码流程，也可使用其他符合OAuth规范的类型。|
     * |`scope`|应用程序域字段数据，该字段存储于`X_APP`中用来限定多应用平台中每个应用的单独信息。|
     *
     * @async
     * @param {Object} request 临时码申请请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static authorize(request = {}) {
        return Ux.ajaxPush('/oauth/authorize', request)
            .then(authorized => {
                /* 追加 authorized 中的 client_id */
                authorized.client_id = request.client_id;
                return Ux.promise(authorized);
            });
    }

    /**
     * ## 「接口」`Ex.I.token`
     *
     * * 接口：`/oauth/token`（POST）
     * * 安全：否
     *
     * 请求格式
     *
     * ```json
     * {
     *     "client_id": "客户ID",
     *     "code": "临时验证码"
     * }
     * ```
     *
     * 使用临时授权码交换令牌专用方法。
     *
     * @async
     * @param {Object} request 交换令牌专用请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static token(request = {}) {
        return Ux.ajaxPush('/oauth/token', request).then(token => {
            token.key = request.client_id;
            return Ux.promise(token);
        });
    }

    /**
     * ## 「接口」`Ex.I.logout`
     *
     * * 接口：`/api/user/logout`（POST）
     * * 安全：是
     *
     * 注销登出专用接口
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static logout() {
        return Ux.ajaxPost('/api/user/logout', {}).catch(error => {
            console.error(error);
            return Ux.promise({unauthorized: true})
        });
    }

    /**
     * ## 「接口」`Ex.I.form`
     *
     * * 接口：`/api/ui/form/:code`（GET）
     * * 安全：是
     *
     * 读取表单专用配置接口，根据表单的code读取表单配置信息。
     *
     * @async
     * @param {Object} params 表单请求，包含表单的`code`。
     * @returns {Promise<T>} 返回Promise。
     */
    static form(params = {}) {
        return Ux.ajaxGet(`/api/ui/form/:code`, params);
    }

    /**
     * ## 「接口」`Ex.I.forms`
     *
     * * 接口：`/api/ui/forms/:identifier`（GET）
     * * 安全：是
     *
     * 读取模型下的表单配置信息，这个接口读取和`identifier`模型相关的所有表单配置信息。
     *
     * @async
     * @param {String} identifier 模型统一标识符。
     * @returns {Promise<T>} 返回Promise
     */
    static forms(identifier) {
        return Ux.ajaxGet(`/api/ui/forms/:identifier`, {identifier}).then(response => {
            response.forEach(item => {
                if (item.metadata) {
                    /* 没有设计 */
                    if (!item.metadata.hasOwnProperty('design')) {
                        item.metadata.design = true;
                    }
                }
            })
            return Ux.promise(response);
        });
    }

    /**
     * ## 「接口」`Ex.I.lists`
     *
     * * 接口：`/api/ui/lists/:identifier`（GET）
     * * 安全：是
     *
     * 读取模型下的所有列表配置信息
     *
     * @async
     * @param {String} identifier 模型统一标识符。
     * @returns {Promise<T>} 返回Promise
     */
    static lists(identifier) {
        return Ux.ajaxGet(`/api/ui/lists/:identifier`, {identifier});
    }

    /**
     * ## 「接口」`Ex.I.action`
     *
     * * 接口：`/api/form/actions`（POST）
     * * 安全：是
     *
     * ```json
     * {
     *     "control": "控件ID，对应 UI_FORM 中的 CONTROL_ID",
     *     "name": "表单名称",
     *     "op": [],
     *     "remote": "Boolean，是否读取远程配置，默认无值。"
     * }
     * ```
     *
     * 该接口会执行分流操作。
     *
     * * 远程读取：`POST /api/form/actions`，尚未开发该接口后端（开发中）。
     * * 本地读取：（默认）直接读取参数中op来构造合法的Action信息。
     *
     * @async
     * @param {Object} params 读取表单中的action专用方法。
     * @returns {Promise<T>} 返回Promise。
     */
    static action(params = {}) {
        if (params.remote) {
            return Ux.ajaxPost(`/api/form/actions`, params);
        } else {
            /* 无权限 */
            const permit = {};
            const {op = {}} = params;
            Object.keys(op).forEach(field => permit[field] = !!op[field]);
            return Ux.promise(permit);
        }
    }

    /**
     * ## 「接口」`Ex.I.user`
     *
     * * 接口：`/api/user`（GET）
     * * 安全：是
     *
     * 读取当前登录用户的基本信息。
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static user() {
        return Ux.ajaxGet(`/api/user`);
    }

    /**
     * ## 「接口」`Ex.I.company`
     *
     * * 接口：`/api/company/employee/:eid`（GET）
     * * 安全：是
     *
     * 根据用户数据中存储的员工主键`employeeId`读取员工所属公司信息，如果未登录则读取的数据为空。
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static company() {
        const user = Ux.isLogged();
        if (user['employeeId']) {
            return Ux.ajaxGet(`/api/company/employee/:eid`, {
                eid: user['employeeId']
            });
        } else {
            return Ux.promise({});
        }
    }

    /**
     * ## 「接口」`Ex.I.password`
     *
     * * 接口：`/api/user/password`（POST）
     * * 安全：是
     *
     * 更新用户登录密码专用接口
     *
     * @async
     * @param {Object} params 更新密码所用的请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static password(params = {}) {
        return Ux.ajaxPost(`/api/user/password`, {
            /*
             * Token中已经包含了用户的 id
             * 所以此处只需要 password 就可以了
             */
            password: Ux.encryptMD5(params.password)
        });
    }

    /**
     * ## 「接口」`Ex.I.profile`
     *
     * * 接口：`/api/user/profile`（POST）
     * * 安全：是
     *
     * 更新登录用户的Profile详细信息。
     *
     * @async
     * @param {Object} params 更新账号专用请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static profile(params = {}) {
        return Ux.ajaxPost(`/api/user/profile`, params);
    }

    /**
     * ## 「接口」`Ex.I.tabular`
     *
     * * 接口：
     *      * 读唯一：`/api/:type/tabular/:code`（GET）
     *      * 读某一类：`/api/type/tabulars/:type`（GET）
     *      * 读几类：`/api/type/tabulars`（POST）
     * * 安全：是
     *
     * 读取`X_TABULAR`专用接口（三义性接口），这个方法分三种方式读取，根据参数判断。
     *
     * ### 内部参数
     *
     * |参数名|含义|
     * |:---|:---|
     * |type|读取的`X_TABULAR`的类型，对应`TYPE`字段。|
     * |code|读取的`X_TABULAR`的编码，对应`CODE`字段。|
     *
     * @async
     * @param {Object} params 当前字典专用请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static tabular(params = {}) {
        return _tabular(params);
    }

    /**
     * ## 「接口」`Ex.I.category`
     *
     * * 接口：
     *      * 读唯一：`/api/:type/category/:code`（GET）
     *      * 读某一类：`/api/type/categories/:type`（GET）
     *      * 读几类：`/api/type/categories`（POST）
     * * 安全：是
     *
     * 读取`X_CATEGORY`专用接口（三义性接口），这个方法会分三种方式读取，根据参数判断。
     *
     * ### 内部参数
     *
     * |参数名|含义|
     * |:---|:---|
     * |type|读取的`X_CATEGORY`的类型，对应`TYPE`字段。|
     * |code|读取的`X_CATEGORY`的编码，对应`CODE`字段。|
     *
     * @async
     * @param {Object} params 当前字典专用请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static category(params = {}) {
        return _category(params);
    }

    /**
     * ## 「接口」`Ex.I.forest`
     *
     * * 接口:
     *      * 读取某一类：`/api/type/categories/:type`（GET）
     *      * 判断节点
     *
     * 节点主要包含两种：
     *
     * * 整棵树：tree =
     * * 树中某个分支：tree = xxx, <condition>
     *
     * 连接模式
     *
     * 1. mode = "REPLACE": 抓取的树直接替换当前节点
     * 2. mode = "CONNECT": 抓取的树作为当前节点的子节点
     *
     * @async
     * @param {String} type 读取某一类 X_CATEGORY 构造森林
     * @param {String} mode 连接模式
     * @returns {Promise<T>} 返回Promise。
     */
    static forest(type, mode = "REPLACE") {
        if (type) {
            return _category({type}).then(categories => {
                /*
                 * 特殊数据结构
                 */
                return Ux.forestGroup(categories, {}, _category).then(grouped => {
                    /*
                     * 根据最终的 grouped 计算 最终的 normalized
                     */
                    return Ux.promise(calcTree(categories, grouped, mode));
                });
            })
        } else return Ux.promise([])
    }


    /**
     * ## 「接口」`Ex.I.page`
     *
     * * 接口：`/api/ui/page`（POST）
     * * 安全：是
     *
     * 1. 先读取`UI_PAGE`中的页面配置信息。
     * 2. 然后读取`UI_LAYOUT`中的模板配置信息。
     * 3. 最后根据`pageId`读取`UI_CONTROL`中的控件配置信息。
     *
     * @async
     * @param {Object} params 页面专用请求
     * @returns {Promise<T>} 返回Promise。
     */
    static page(params = {}) {
        return Ux.ajaxPost('/api/ui/page', params);
    }

    /**
     * ## 「接口」`Ex.I.control`
     *
     * * 接口：`/api/ui/control`（POST）
     * * 安全：是
     *
     * ```json
     * {
     *     "type": "两种类型",
     *     "control": "控件ID"
     * }
     * ```
     *
     * 读取控件配置`UI_CONTROL`相关数据。
     *
     * ### 内部参数
     *
     * |参数名|含义|
     * |:---|:---|
     * |type|读取的控件类型信息，目前分为`FORM | LIST`三种，不仅读取`UI_CONTROL`表，也会读取子表信息。|
     * |control|传入需要读取控件的ID值。|
     *
     * * type = FORM，读取表单配置数据。
     * * type = LIST，读取列表配置数据。
     *
     * @async
     * @param {Object} params 控件专用请求
     * @returns {Promise<T>} 返回Promise。
     */
    static control(params = {}) {
        return Ux.ajaxPost('/api/ui/control', params);
    }

    /**
     ## 「接口」`Ex.I.visitor`
     *
     * * 接口：`/ui/visitor/:identifier/:page`（POST）
     * * 安全：是
     *
     * ```json
     * {
     *     "identifier": "路径参数，模型标识符",
     *     "page": "页面ID",
     *     "view": "「位置1」视图信息",
     *     "position": "「位置2」位置信息",
     *     "type": "类型选择，FORM / LIST",
     *     "alias": "「位置3」别名信息"
     * }
     * ```
     *
     * 位置信息计算规则：view / position / alias
     *
     * - view：视图信息，直接从 $myView 中提取。
     * - position：位置信息，直接从 $myView 中提取。
     * - alias：别名处理，同样用来计算 alias。
     *
     * ### 内部参数
     *
     * |参数名|含义|
     * |:---|:---|
     * |type|读取控件的专用类型，主要包含`FORM | LIST`两种。|
     * |identifier|模型标识符。|
     * |page|页面专用ID。|
     * |view/position/alias|专用位置计算信息。|
     *
     * @async
     * @param params {Object} params 参数信息
     * @returns {Promise<T>} 返回Promise
     */
    static visitor(params = {}) {
        return Ux.ajaxPost('/api/ui/visitor/:identifier/:page', params);
    }

    /**
     * ## 「接口」`Ex.I.ops`
     *
     * * 接口：`/api/ui/ops`（POST）
     * * 安全：是
     *
     * 读取操作专用配置`UI_OP`，入参为：
     *
     * ```json
     * {
     *     "control": "控件ID",
     *     "identifier": "模型标识符",
     *     "type": "OP"
     * }
     * ```
     *
     * ### 内部参数
     *
     * |参数名|含义|
     * |:---|:---|
     * |type|固定值OP，暂定为只读取OP相关信息。|
     * |control|（动态读取专用）传入需要读取控件的ID值，读取和`UI_CONTROL`相关的数据库记录。|
     * |identifier|（静态读取专用）传入模型标识符，读取静态配置，配置文件在`plugin/ui/ops.json`中。|
     *
     * @async
     * @param {Object} params 控件专用请求
     * @returns {Promise<T>} 返回Promise
     */
    static ops(params = {}) {
        return Ux.ajaxPost('/api/ui/ops', params);
    }

    /**
     * ## 「接口」`Ex.I.token`
     *
     * * 接口：
     *      * 确认：`/api/todo/confirm/:key`（PUT）
     *      * 拒绝：`/api/todo/reject/:key`（PUT）
     * * 安全：是
     *
     * Todo待办的确认和拒绝专用接口。
     *
     * @async
     * @param {Object} params 待办专用请求
     * @param {boolean} confirmed 确认待办还是拒绝待办
     * @returns {Promise<T>} 返回Promise
     */
    static todo(params = {}, confirmed = true) {
        const request = {key: params.key, data: params.data};
        if (confirmed) {
            return Ux.ajaxPut('/api/todo/confirm/:key', request);
        } else {
            return Ux.ajaxPut('/api/todo/reject/:key', request);
        }
    }

    /**
     * ## 「接口」`Ex.I.mission`
     *
     * * 接口：`/api/job/info/mission/:key`（GET）
     * * 安全：是
     *
     * 读取 Mission 相关的 Job任务配置。
     *
     * @async
     * @param {String} key 当前任务的`key`主键
     * @returns {Promise<T>} 返回Promise
     */
    static mission(key) {
        return Ux.ajaxGet("/api/job/info/mission/:key", {key})
            .then((mission = {}) => Ux.promise(Fn.inJob(mission)));
    }

    /**
     * ## 「接口」`Ex.I.jobs`
     *
     * * 接口：`/api/job/info/by/sigma`（GET）
     * * 安全：是
     *
     * 读取当前系统中所有的任务信息（按sigma分类）。
     *
     * @async
     * @returns {Promise<T>} 返回Promise
     */
    static jobs(params) {
        const $request = Ux.clone(params);
        $request.criteria[""] = true;
        return Ux.ajaxPost("/api/job/info/by/sigma?group=true", $request).then((response = []) => {
            const {list = [], count, aggregation = {}} = response;
            const jobs = [];
            list.forEach((mission = {}) => {
                const processed = Fn.inJob(mission);
                /*
                 * 不为空的时候执行 push 将 job 压入
                 */
                if (!Ux.isEmpty(processed)) {
                    jobs.push(processed);
                }
            });
            return Ux.promise({list: jobs, count, aggregation});
        })
    }

    /**
     * ## 「接口」`Ex.I.jobStart`
     *
     * * 接口：`/api/job/start/:key`（PUT）
     * * 安全：是
     *
     * 启动任务专用接口
     *
     * @async
     * @param {String} key 启动任务的键。
     * @returns {Promise<T>} 返回Promise。
     */
    static jobStart(key) {
        return Ux.ajaxPut("/api/job/start/:key", {key});
    }

    /**
     * ## 「接口」`Ex.I.jobStop`
     *
     * * 接口：`/api/job/stop/:key`（PUT）
     * * 安全：是
     *
     * 停止任务专用接口
     *
     * @async
     * @param {String} key 停止任务的键。
     * @returns {Promise<T>} 返回Promise。
     */
    static jobStop(key) {
        return Ux.ajaxPut("/api/job/stop/:key", {key});
    }

    /**
     * ## 「接口」`Ex.I.jobResume`
     *
     * * 接口：`/api/job/resume/:key`（PUT）
     * * 安全：是
     *
     * 恢复任务专用接口，`I_JOB`特定应用。
     *
     * @async
     * @param {String} key 恢复任务的键。
     * @returns {Promise<T>} 返回Promise。
     */
    static jobResume(key) {
        return Ux.ajaxPut("/api/job/resume/:key", {key});
    }

    /**
     * ## 「接口」`Ex.I.relation`
     *
     * * 接口：`/api/relation`（GET）
     * * 安全：是
     *
     * 读取关系定义专用接口
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static relation() {
        return Ux.ajaxGet("/api/relation", {});
    }

    /**
     * ## 「接口」`Ex.I.relationSave`
     *
     * * 接口：`/api/ox/relation/save`（POST）
     * * 安全：是
     *
     * 存储关系专用
     *
     * @async
     * @param {Array} relations 存储关系专用
     * @returns {Promise<T>} 返回Promise。
     */
    static relationSave(relations = []) {
        return Ux.ajaxPost("/api/ox/relation/save", {
            $body: relations,
        });
    }

    /**
     * ## 「接口」`Ex.I.relationDelete`
     *
     * * 接口：`/api/ox/relation/remove`（POST）
     * * 安全：是
     *
     * 删除关系专用接口
     *
     * @async
     * @param {Array} keys 将要被删除的关系的 key 集合
     * @returns {Promise<T>} 返回Promise。
     */
    static relationDelete(keys = []) {
        return Ux.ajaxPost("/api/ox/relation/remove", {
            $body: keys,
        });
    }

    /**
     * ## 「接口」`Ex.I.apis`
     *
     * * 接口：`/api/x-api/search`（POST）
     * * 安全：是
     *
     * 读取当前系统中所有的接口信息，读取时候自动为系统追加查询条件：
     *
     * ```json
     * {
     *     "criteria": {
     *         "": true
     *     }
     * }
     * ```
     *
     * 根据查询引擎规范该条件追加后，会生成`AND`操作符来连接所有的`params`中存在的条件。
     *
     * @async
     * @returns {Promise<T>} 返回Promise
     */
    static apis(params) {
        const $request = Ux.clone(params);
        $request.criteria[""] = true;
        return Ux.ajaxPost("/api/x-api/search", $request).then((response = []) => {
            return Ux.promise(response);
        })
    }

    /**
     * ## 「接口」`Ex.I.uri`
     *
     * * 接口：`/api/x-api/:key`（GET）
     * * 安全：是
     *
     * 读取具体 uri 配置。
     *
     * @async
     * @param {String} key 当前任务的`key`主键
     * @returns {Promise<T>} 返回Promise
     */
    static uri(key) {
        return Ux.ajaxGet("/api/x-api/:key", {key})
            .then((uri = {}) => Ux.promise(Fn.inApi(uri)));
    }
}

export default I;