import __Zs from 'zs';

export default {
    /**
     * ## 「标准」 `Ux.dndDropColor`
     *
     * @memberOf module:dnd/zest
     * @param reference
     * @param isOver
     * @param additional
     */
    dndDropColor: (reference, isOver, additional) =>
        __Zs.dndDropColor(reference, isOver, additional),
    /**
     * ## 「标准」 `Ux.dndDropWrap`
     *
     * @memberOf module:dnd/zest
     * @param reference
     * @param renderFn
     * @returns {*}
     */
    dndDropWrap: (reference, renderFn) => __Zs.dndDropWrap(reference, renderFn),
    /**
     * ## 「标准」 `Ux.dndDropHoc`
     *
     * @memberOf module:dnd/zest
     * @param options
     * @returns {*}
     */
    dndDropHoc: (options) => __Zs.dndDropHoc(options),
    /**
     * ## 「标准」 `Ux.dndDragHoc`
     *
     * @memberOf module:dnd/zest
     * @param options
     * @returns {*}
     */
    dndDragHoc: (options) => __Zs.dndDragHoc(options),
    /**
     * ## 「标准」 `Ux.dndDragColor`
     *
     * @memberOf module:dnd/zest
     * @param reference
     * @param renderFn
     * @returns {*}
     */
    dndDragWrap: (reference, renderFn) => __Zs.dndDragWrap(reference, renderFn)
}