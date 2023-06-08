/**
 * @name zone._OfState
 * @class _OfState
 */
const _OfState = {
    /** */ submitting: () => ({}),
    /** */ _submitting: () => ({}),
}
/**
 * @name zone._OfFn
 * @class _OfFn
 */
const _OfFn = {
    /** */ ioIn: () => ({}),
    /** */ ioOut: () => ({}),
    /** */ qrV: () => ({}),
    /** */ qrQ: () => ({}),
    /**
     *
     * ## 「父类调用」`rxFilter`
     *
     * ### 内部流程
     *
     * 调用父类的 `rxFilter` 函数，调用时会执行如下步骤：
     *
     * ```js
     * // 旧版本会使用下边的状态构造，新版本直接传 $qr
     * // const state = {}
     * // state.$qr = qr;
     * rxFilter($qr, addOn);
     * ```
     *
     * 此处的 `addOn` 为附加状态，您可以通过 `addOn` 传递基础状态，而第一个参数会直接转变成 `$qr` 变量。
     *
     * ### 返回信息
     *
     * ```js
     * {
     *     $condition: {},
     *     $qr: {},
     *     $keyword: {}
     * }
     * ```
     *
     * @async
     * @param {Object} qr 构造的 `$qr` 变量
     * @param {Object} addOn 附加状态
     *
     * */ qrFilter: (qr, addOn) => ({qr, addOn}),
    /** */ submitting: () => ({}),
    /** */ submitted: () => ({}),
    /** */ closeAnd: () => ({}),
    /** */ close: () => ({}),
    /** */ closeOnly: () => ({}),
    /** */ open: () => ({}),
    /** */ view: () => ({}),
    /** */ open_: () => ({}),
    /** */ close_: () => ({}),
    /** */ delete_: () => ({}),
    /** */ selected_: () => ({}),
}
/**
 * @name zone._Of
 * @class _Of
 */
const _Of = {
    /**
     * @instance
     * */
    _: _OfFn,
    /**
     * @instance
     */
    is: _OfState,
    /** **/ paging: () => ({}),
    /** **/ paged: () => ({}),
    /** **/ in: () => ({}),
    /** **/ up: () => ({}),
    /** **/ open: () => ({}),
    /** **/ hide: () => ({}),
    /** **/ readying: () => ({}),
    /** **/ ready: () => ({}),
    /** **/ spinning: () => ({}),
    /** **/ spun: () => ({}),
    /** **/ submitting: () => ({}),
    /** **/ submitted: () => ({}),
    /** **/ loading: () => ({}),
    /** **/ loaded: () => ({}),
    /** **/ done: () => ({}),
    /** **/ handle: () => ({}),
    /**
     * @async
     * **/ future: () => ({}),
    /**
     * @async
     */
    next: () => ({}),
    /**  */ close: () => ({}),
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    _Of,
}