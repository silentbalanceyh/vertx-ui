import __Zn from './zero.module.dependency';
import {_Session, _Storage} from 'zo';
import __QM from './router.__.fn.query.norm';

const Cv = __Zn.Env;

const toRoute = (reference = {}, uri = "", params = {}) => {
    __Zn.fxTerminal(!uri, 10072, uri);
    __Zn.fxTerminal(!reference.hasOwnProperty(Cv.K_NAME._PROPS)
        || !reference.props.hasOwnProperty(Cv.K_NAME.ROUTER),
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
    const queryMap = __QM.queryPart(queryPart);
    Object.assign($parameters, queryMap, params ? params : {});
    /*
     * 3. 计算 inputParams 中的内部逻辑（mid, pid, target）
     */
    const mid = __QM.queryRoute(Cv.K_ARG.MID, params);
    const pid = __QM.queryRoute(Cv.K_ARG.PID, params);
    if (mid) $parameters.mid = mid;
    if (pid) $parameters.pid = pid;
    if ($parameters.target) {
        $parameters.target = __Zn.encryptBase64($parameters.target);
    }
    /*
     * 内部参数处理
     */
    const internal = {};
    const external = {};
    Object.keys($parameters).forEach(field => {
        if (field.startsWith("_")) {
            internal[field] = $parameters[field];
        } else {
            external[field] = $parameters[field];
        }
    });
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
    const normalized = __QM.queryNorm(normalizedUri, external);
    const {$router} = reference.props;
    $router.to(normalized, internal);
};

const toLogout = (cleanApp = true) => {
    /* 注销用户 */
    const key = Cv.KEY_USER;
    _Session.remove([key]);

    if (cleanApp) {
        /* 删除 appKey */
        _Storage.remove(Cv.X_APP_KEY);
        /* 删除菜单和关联应用 */
        _Session.remove([
            Cv.PAGE_MENU,
            Cv.PAGE_APP,
        ]);
        const app = _Session.get(Cv.KEY_APP);
        if (app && app['appKey']) {
            delete app['appKey'];
            _Storage.put(Cv.KEY_APP, app);
        }
    }
    return true;
};
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
const toPassword = (reference = {}) =>
    toRoute(reference, Cv.ENTRY_FIRST);

const toOriginal = (reference = {}, switched, exclude = []) => {
    const original = __Zn.toQuery(Cv.K_ARG.TARGET);
    if (original) {
        const {$router} = reference.props;
        const params = __Zn.clone($router.params());
        const $removed = [Cv.K_ARG.KEY, Cv.K_ARG.ID, Cv.K_ARG.TARGET].concat(exclude);
        $removed.forEach(field => {
            if (params[field]) {
                delete params[field];
            }
        })
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
const toLink = (data, $app) => {
    if (!data) data = [];
    if (__Zn.isArray(data)) {
        return data.map(item => toLink(item, $app));
    } else {
        if ("string" === typeof data) {
            const path = $app._("path") ? $app._("path") : Cv['ROUTE'];
            if (!data.startsWith("/")) {
                data = `/${data}`;
            }
            let relatedPath = `${path}${data}`;
            if (!relatedPath.startsWith('/')) {
                relatedPath = `/${relatedPath}`;
            }
            return relatedPath;
        } else if (__Zn.isObject(data)) {
            data.uri = toLink(data.uri, $app);
            return data;
        }
    }
};
export default {
    toRoute,
    toLink,
    toLogout,
    toPassword,
    toUnauthorized,
    toOriginal,
}