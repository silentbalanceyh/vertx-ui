import U from "underscore";
import Ux from "ux";
import Fn from "../functions";

const _assist = (uris = {}) => (params) => {
    if (params) {
        if (U.isArray(params)) {
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
                    return Fn.error009();
                }
            }
        }
    } else {
        /* 拒绝调用，参数不全 */
        return Fn.error009();
    }
};

const _tabular = _assist({
    code: "/api/:type/tabular/:code",
    type: "/api/type/tabulars/:type",
    types: "/api/type/tabulars",
    category: "__zero.tabular__"
});

const _category = _assist({
    code: "/api/:type/category/:code",
    type: "/api/type/categories/:type",
    types: "/api/type/categories",
    category: "__zero.category__"
});
export default {
    /*
     * GET /api/:type/tabular/:code
     * GET /api/type/tabulars/:type
     * POST /api/type/tabulars
     * */
    tabular: _tabular,
    /*
     * GET /api/:type/category/:code
     * GET /api/type/categories/:type
     * POST /api/type/categories
     */
    category: _category,
}