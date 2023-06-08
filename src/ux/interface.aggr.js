import __ZS from 'zs';

export default {
    /**
     * ## 「标准」`Ux.aggrSum`
     *
     * @memberOf module:aggr/zest
     * @param grouped
     * @param config
     * @param source
     * @returns {*}
     */
    aggrSum: (grouped = {}, config = {}, source = []) =>
        __ZS.aggrSum(grouped, config, source)
}