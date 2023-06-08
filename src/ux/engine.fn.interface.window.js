import __Zi from 'zi';

/**
 * @deprecated
 * @memberOf module:hoc/zion
 */
const ltrResize = (reference) => __Zi.wl(reference);

export default {
    ltrResize,
    /**
     * 「标准」`Ux.wl`
     *
     * @memberOf module:hoc/zion
     * @param reference
     * @returns {*}
     */
    wl: (reference) => __Zi.wl(reference),
}