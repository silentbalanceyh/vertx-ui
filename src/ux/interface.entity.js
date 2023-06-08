import {_Uarr as Uarr, _Uson as Uson} from "zo"
import __Zi from 'zi';
import __Zr from 'zero';

/**
 * ## 「标准」`Ux.rxDatum`
 *
 * Redux 反向处理器
 *
 * 1. 处理 Tabular
 * 2. 多种 Tabular 时，仅按类别分组处理
 *
 * 用于处理 tabular（`X_TABULAR`）在 redux 层面的状态树专用数据结构。
 *
 * @memberOf module:rx/zion
 * @param {Array} input 传入的数据源信息。
 * @param {String} orderField 排序专用信息。
 * @param {String} groupField 分组专用信息，如果分组的话执行多个值。
 * @return {Object} 返回最终的数据信息，存储在 `tabular` 节点中。
 */
const rxDatum = (input, orderField = 'sort', groupField = 'type') =>
    __Zi.rxDatum(input, orderField, groupField);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /**
     * ## 「引擎」`Ux.createAction`
     *
     * 创建 redux 中所需要的 Action 信息，内部调用 `redux-act`。
     *
     * @memberOf module:data/zion
     * @param {String} path 核心路径信息，不同的 redux 的 Action可以使用不同的值。
     * @return {EmptyActionCreator} 返回创建好的 Action。
     */
    createAction: (path) => __Zi.createAction(path),
    Uarr,
    Uson,
    /**
     * ## 「引擎」`Ux.fnOut`
     *
     * Redux 树的统一处理 reducer 数据。
     *
     * @memberOf module:data/zion
     * @method fnOut
     * @param {Object} state 原始状态信息。
     * @param {Object} inState 初始化状态信息。
     */
    fnOut: __Zi.fnOut,
    /**
     * ## 「引擎」`Ux.dataOut`
     *
     * 处理状态专用输出，以下边两种数据结构写入到 Redux 树中。
     *
     * * DataObject：数据单记录模型。
     * * DataArray：数据多记录模型。
     *
     * @memberOf module:data/zion
     * @method dataOut
     * @param {Object} data 初始化数据值。
     * @return {Action} 返回 `redux-act` 创建的操作专用。
     */
    dataOut: (data) => __Zi.dataOut(data),
    /**
     * ## 「引擎」`Ux.dataIn`
     *
     * Redux专用状态树的读取方法，读取数据的调用代码：
     *
     * ```js
     * @Ux.zero(Ux.rxEtat(require('./Cab.json'))
     *      .cab("UI")
     *      .loading("app")
     *      .connect(state => Ux.dataIn(state)
     *          .revamp(["app"])
     *          .to()
     *      )
     *      .connect({
     *          fnApp: Ex.epicApp
     *      }, true)
     *      .to()
     * )
     * ```
     *
     * @memberOf module:data/zion
     * @method dataIn
     * @param {Object} state Redux读取到的状态值相关信息，作为输出。
     * @returns {StateOut} 返回状态数据。
     */
    dataIn: (state) => __Zi.dataIn(state),
    /**
     ## 「引擎」`Ux.dataCab`
     *
     * @memberOf module:data/zion
     * @param cab
     * @param filename
     * @returns {*|{}}
     */
    dataCab: (cab = {}, filename) => __Zi.dataCab(cab, filename),
    /**
     * ## 「标准」`Ux.rxEtat`
     *
     * 用于处理专用的资源文件绑定类。
     *
     * 调用代码如：
     *
     * ```js
     * &#64;Ux.zero(Ux.rxEtat(require('../Cab.json'))
     *      .cab("UI.Filter")
     *      .raft(1)
     *      .form().to()
     * )
     * ```
     *
     * @memberOf module:rx/zero
     * @method rxEtat
     * @returns {RxEtat} 返回最终 @zero 注解中的状态，构造资源文件绑定对象。
     */
    rxEtat: requiredFile => __Zr.rxEtat(requiredFile),

    rxDatum,

    /**
     * ## 「标准」`Ux.rxAssist`
     *
     * Redux 反向处理器，处理 Assist 第三关联表数据。
     *
     * @memberOf module:rx/zion
     * @param {Array} input 传入的数据源信息。
     * @param {String} key 当前数据绑定的辅助用key。
     * @param {String} order 排序字段。
     * @return {Object} 最终的数据信息，存储在 `assist` 节点中。
     */
    rxAssist: (input, key, order = 'sort') =>
        __Zi.rxAssist(input, key, order),
    /* Ajax 专用方法用于生成 ajax / processor 结构 */
    // rjTabular,
    // rjAssist
}