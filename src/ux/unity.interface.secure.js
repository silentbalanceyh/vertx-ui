import __Zo from 'zo';

/**
 * ##「标准」`Ux.digitToken`
 *
 * 返回安全请求中的令牌信息，最终会根据应用模式处理成 Authorization 的计算值。
 *
 * @memberOf module:secure/zodiac
 * @return {String} 返回当前用户登录过后的令牌`token`信息。
 */
const digitToken = () => __Zo.token();
/**
 * ##「标准」`Ux.digitSign`
 *
 * Zero UI中的RESTful 数字签名功能专用函数。
 *
 * @memberOf module:secure/zodiac
 * @param {String} uri 待签名的路径信息。
 * @param {String} method 待签名的方法信息。
 * @param {Object} params 待签名的方法参数。
 */
const digitSign = (uri, method = "GET", params = {}) => __Zo.signature(uri, method, params);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 签名专用函数
    digitSign,
    // 读取当前用户登录过后的token，如果未登录则会返回undefined
    digitToken,
    /**
     * ## 「标准」`Ux.aclOp`
     *
     * @memberOf module:secure/zodiac
     * @param options
     * @param ops
     */
    aclOp: (options = {}, ops) => __Zo.aclOp(options, ops),
    /**
     * ## 「标准」`Ux.aclData`
     *
     * @memberOf module:secure/zodiac
     * @param $inited
     * @param reference
     * @param $edition
     */
    aclData: ($inited = {}, reference, $edition) => __Zo.aclData($inited, reference, $edition),
    /**
     * ## 「标准」`Ux.aclSubmit`
     *
     * @memberOf module:secure/zodiac
     * @param params
     * @param reference
     * @returns {*}
     */
    aclSubmit: (params = {}, reference) => __Zo.aclSubmit(params, reference)
}