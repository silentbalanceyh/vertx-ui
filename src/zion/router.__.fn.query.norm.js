import __Zn from './zero.module.dependency';

const queryPart = (queryPart) => {
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
const queryNorm = (normalizedUri, $parameters = {}) => {
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
const queryRoute = (name = "", params = {}) => {
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
                const queryValue = __Zn.toQuery(name);
                if (queryValue && "undefined" !== queryValue) {
                    /*
                     * 从 Uri 路径中读取到了参数信息 name = ?
                     */
                    return queryValue;
                }
            }
        }
    } else {
        const queryValue = __Zn.toQuery(name);
        if (queryValue && "undefined" !== queryValue) {
            /*
             * 从 Uri 路径中读取到了参数信息 name = ?
             */
            return queryValue;
        }
    }
}
export default {
    queryNorm,
    queryPart,
    queryRoute,
}