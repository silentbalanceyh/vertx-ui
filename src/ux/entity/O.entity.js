// 导入自定义核心库
import {Taper} from "environment";
import {Dsl} from "entity";

export default {
    /**
     * ## 标准函数
     *
     * Redux 树的统一处理 reducer 数据。
     *
     * @memberOf module:_redux
     * @method fnOut
     * @param {Object} state 原始状态信息。
     * @param {Object} inState 初始化状态信息。
     */
    fnOut: Taper.fnFlush,
    /**
     * ## 标准函数
     *
     * 处理状态专用输出，以下边两种数据结构写入到 Redux 树中。
     *
     * * DataObject：数据单记录模型。
     * * DataArray：数据多记录模型。
     *
     * @memberOf module:_redux
     * @method dataOut
     * @param {Object} data 初始化数据值。
     * @return {Action} 返回 `redux-act` 创建的操作专用。
     */
    dataOut: (data) => Taper.fnFlush(Dsl.createIn(data)),
    /**
     * ## 标准函数
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
     * @memberOf module:_redux
     * @method dataIn
     * @param {Object} state Redux读取到的状态值相关信息，作为输出。
     * @returns {StateOut} 返回状态数据。
     */
    dataIn: (state) => Dsl.createOut(state),
    /**
     * ## 标准函数
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
     * @memberOf module:_rx
     * @method rxEtat
     * @returns {RxEtat} 返回最终 @zero 注解中的状态，构造资源文件绑定对象。
     */
    rxEtat: requiredFile => Dsl.rxEtat(requiredFile),
    /**
     * ## 标准函数
     *
     * Stream 模式处理 Redux 初始化过程中的数据读取
     *
     * 1. 并且 Ajax
     * 2. 串行 Ajax
     * 3. 读取 Tabular / Assist / Category
     *
     * 内部调用代码：
     *
     * ```js
     * const flow = {
     *      fnInited: Ux.rxFlow(Types.fnInited)
     *          .bind(Ajax)
     *          .mount(
     *              'app',
     *              'app.menus'
     *          )
     *          .to()
     * }
     * ```
     *
     * @memberOf module:_rx
     * @method rxFlow
     * @returns {rxFlow} 返回最终 @zero 注解中的Stream模式的 redux处理器。
     */
    rxFlow: actions => Dsl.rxFlow(actions),
}