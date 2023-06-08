import __Zs from 'zs';

const dataIo = (request = {}, config = {}, reference) =>
    __Zs.dataIo(request, config, reference);
export default {
    /**
     * ##「引擎」`Ux.dataIo`
     * @method dataIo
     * @memberOf module:data/zest
     * @param {Object} request 请求数据
     * @param {Object} config 配置数据
     * @param {React.PureComponent} reference React对应组件引用
     */
    dataIo,
    /*
     * field = {
            "inSource": "linkageAsset",
            "inPath": "targetData",
            "outType": "ARRAY"
     * }
     */
    /**
     * ##「引擎」`Ux.dataOut`
     * @memberOf module:data/zest
     * @param request
     * @param io
     * @param reference
     */
    dataWrite: (request = {}, io = {}, reference) =>
        __Zs.dataWrite(request, io, reference),
    /**
     * ##「引擎」`Ux.dataIn`
     * @memberOf module:data/zest
     * @param $inited
     * @param config
     * @param reference
     * @returns {*}
     */
    dataRead: ($inited = {}, config = {}, reference) =>
        __Zs.dataRead($inited, config, reference),
}