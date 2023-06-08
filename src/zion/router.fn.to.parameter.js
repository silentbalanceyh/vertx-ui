import __Zn from './zero.module.dependency';
import __QM from './router.__.fn.query.norm';

const Cv = __Zn.Env;
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
    const queryMap = __QM.queryPart(queryPart);
    if (key && value) {
        queryMap[key] = value;
    }
    return __QM.queryNorm(basePart, queryMap);
}
const toPid = (reference, data = [], state = {}) => {
    const page = __Zn.toQuery(Cv.K_ARG.PID); // toQuery("pid");
    if (page) {
        const branch = __Zn.elementBranch(data, page, 'parentId');
        if (__Zn.isArray(branch)) {
            const keySet = new Set(branch.map(item => item.key));
            keySet.delete(page);

            const $keySet = {};
            $keySet.defaultOpenKeys = Array.from(keySet);
            $keySet.defaultSelectedKeys = [page];
            state.$keySet = $keySet;
        }
    }
}
const toVis = (view, position) => (view && position)
    ? encodeURIComponent(`[${view},${position}]`) : undefined;
const toUri = (uri, $app) => {
    let path;
    if ($app) {
        path = $app._("path") ? $app._("path") : Cv.ROUTE;
    } else {
        path = Cv.ROUTE;
    }
    let relatedPath = `${path}${uri}`;
    if (!relatedPath.startsWith('/')) {
        relatedPath = `/${relatedPath}`;
    }
    return relatedPath;
}
export default {
    toUri,          // Uri Parsing based on $app -> $DataRouter
    toUrl,          // Uri Normalization
    toPid,
    toVis,
}