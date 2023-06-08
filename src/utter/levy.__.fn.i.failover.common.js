import Ux from "ux";
import _Refuse from './tracer.c.refuse.async';
import __API from './variant-api';
import __IP from './levy.__.fn.ask.processor';
import __Wth from './levy.__.fn.with.branch';
import __V from './pedestal.v.constant.option';
// =====================================================
// application 应用接口
// =====================================================
const iApplication = () => {
    /* 读取应用程序 */
    const appData = Ux.isInit();
    if (appData) {
        return __Wth.withApp(appData);
    } else {
        /* 拒绝调用，应用程序未初始化 */
        return _Refuse.error001();
    }
};
const iMenus = () => {
    const appData = Ux.isInit();
    if (appData && appData.key) {
        const menuStored = Ux.Session.get(Ux.Env.PAGE_MENU);
        if (menuStored) {
            return Ux.promise(menuStored);
        } else {
            return __IP.askRapid(__API.api_get_menus).then(response => {
                Ux.Session.put(Ux.Env.PAGE_MENU, response);
                return Ux.promise(response);
            });
        }
    } else {
        /* 拒绝调用，应用程序未初始化 */
        return _Refuse.error001();
    }
};

const _iAssist = (uris = {}) => (params) => {
    if (params) {
        /* 1. params = [], 最高优先级 */
        if (Ux.isArray(params)) {
            return __IP.askRapid(uris.types, params);
        }
        /* 2. 包含 type，次高优先级 */
        if (params.type) {
            if (params.code) {
                return __IP.askRapid(uris.code, params);
            } else {
                return __IP.askRapid(uris.type, params);
            }
        }
        /* 3. 业务判断 identifier */
        if (params.identifier) {
            const request = {
                type: uris.category,           // 默认系统顶级类型
                code: params.identifier
            }
            return __IP.askRapid(uris.code, request);
        } else {
            return _Refuse.error009();
        }
    } else {
        /* 拒绝调用，参数不全 */
        return _Refuse.error009();
    }
};
export default {
    iApplication,
    iMenus,
    iTabular: _iAssist({
        code: __API.d_api_get_$type_tabular_$code,
        type: __API.d_api_get_type_tabulars_$type,
        types: __API.d_api_post_types_tabulars,
        category: __V.V.TYPE_TABULAR,
    }),
    iCategory: _iAssist({
        code: __API.d_api_get_$type_category_$code,
        type: __API.d_api_get_type_categories_$type,
        types: __API.d_api_post_types_categories,
        category: __V.V.TYPE_CATEGORY,
    })
}