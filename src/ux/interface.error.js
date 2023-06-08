import __Zn from 'zone';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /**
     * ## 「标准」`Ux.E.fxRedux`
     *
     * 只会使用在 Redux 环境中的响应处理器，目前是框架内部使用，带监控流程生成日志。
     *
     * 内部调用代码如下：
     *
     * ```js
     * const actionType = $action.ofType(type.getType());
     * const source = from(actionType);
     * return source.pipe(
     *      map(action => action.payload),
     *      map(promise),
     *      switchMap(promise => from(promise).pipe(
     *          map(responser),
     *          map(E.fxRedux),
     *          map(data => Rdx.dataOut(data))
     *      ))
     * );
     * ```
     *
     * @memberOf module:development/zone
     * @method fxRedux
     * @param {String|Object} object 传入的数据信息。
     * @param {any} original 原始数据问题。
     * @return {any} 传入什么返回什么，使用函数链操作。
     */
    fxRedux: __Zn.fxRedux,

    /**
     * ## 「标准」`Ux.E.fxTerminal`
     *
     * （高频）带条件的错误消息，构造内部消息专用，高频使用函数，和内部错误代码绑定。
     *
     * 调用代码如下：
     *
     * ```js
     *      // ns 属性检查
     *      Ux.E.fxTerminal(!Cab || !Cab.hasOwnProperty("ns"), 10050, Cab);
     *      // 参数名称检查
     *      Ux.E.fxTerminal(!Name, 10051, Name);
     * ```
     *
     * 注意首参可以是一个直接条件，也可以是一个Function，最终执行的结果进行JavaScript级别的判断，判断条件成功
     * 则打印错误信息，如果判断条件失败则不打印错误信息，并且这个函数不会中断执行，也就是不抛出任何异常信息。
     *
     * @memberOf module:development/zone
     * @method fxTerminal
     * @param {Function|boolean} fnCond 条件值或条件函数，满足时执行。
     * @param {Number} code 内部错误编码。
     * @param {any[]} args 错误信息中所需的参数（可变）。
     * @return {String} 使用 error 打印警告信息，并且生成最终的警告信息。
     */
    fxTerminal: __Zn.fxTerminal,

    /**
     * ## 「标准」`Ux.E.fxWarning`
     *
     * （略）用法同`fxTerminal`，只是这个函数使用的输出管道为`console.warn`，而`fxTerminal`的输出管道为`console.error`。
     *
     * @memberOf module:development/zone
     * @method fxWarning
     * @param {Function|boolean} fnCond 条件值或条件函数，满足时执行。
     * @param {Number} code 内部错误编码。
     * @param {any[]} args 错误信息中所需的参数（可变）。
     * @return {String} 使用 warn 打印警告信息，并且生成最终的警告信息。
     */
    fxWarning: __Zn.fxWarning,

    /**
     * ## 「标准」`Ux.E.fxError`
     *
     * 容错专用函数，消息处理函数，生成最终的 error 的状态信息，多用于 React 中的错误 state，生成的对象结构如：
     *
     * ```json
     * {
     *     "code": "错误代码",
     *     "error": "错误信息（可根据参数执行消息）"
     * }
     * ```
     *
     * @memberOf module:development/zone
     * @method fxError
     * @param {Number} code 内部错误编码。
     * @param {any[]} args 错误信息中所需的参数（可变）。
     * @return {{code: *, error: String}} 返回最终的错误状态，组件可消费。
     */
    fxError: __Zn.fxError,

    /**
     * ## 「标准」`Ux.E.fxMessage`
     *
     * 容错专用函数，生成`fxError`中需要使用的`error`节点的信息，支持表达式替换，会将数据输入到表达式中。
     *
     * 容错专用函数，消息处理函数，生成最终合并的 Message 相关信息
     *
     * @memberOf module:development/zone
     * @method fxMessage
     * @param {Number} code 内部错误编码。
     * @param {any[]} args 错误信息中所需的参数（可变）。
     * @returns {String} 返回最终的字符串信息。
     */
    fxMessage: __Zn.fxMessage,

    /**
     *
     * ## 「标准」`Ux.E.fxFatal`
     *
     * 容错专用函数，终止函数，一旦出错不打印任何信息，直接抛出 Error，最终会 throw Error 导致系统中断，
     * 注意该函数会引起错误终端导致程序无法运行，一般是严重错误才使用。
     *
     * @memberOf module:development/zone
     * @method fxFatal
     * @param {Number} code 内部错误编码
     * @param {any[]} args 错误信息中所需的参数（可变）
     * @throws 错误信息异常会被抛出
     */
    fxFatal: __Zn.fxFatal,


    /**
     * ## 「标准」`Ux.E.fxFailure`
     *
     * 容错专用函数，渲染错误界面（渲染内部带有错误编码的错误界面）, 该操作作用于jsx，目的是输出错误信息到界面，
     * 在很多地方可直接使用该方法实现容错界面呈现。
     *
     * @memberOf module:development/zone
     * @method fxFailure
     * @param {Number|String} code 内部错误编码
     * @param {any[]} args 错误信息中所需的参数（可变）
     * @return {Jsx}
     */
    fxFailure: __Zn.fxFailure,
    /**
     * ## 「标准」`Ux.E.fxCatch`
     *
     * 专用于 promise 中的 catch 方法的函数，通常调用如：
     *
     * ```js
     * ... promise.then(xxxx => ).catch(Ux.E.fxCatch(xxx, reference))
     * ```
     *
     * 最终生成的数据结构：
     * 1. error 专用，state.error 赋值
     * 2. 远程响应数据结构如：
     *
     *      ```json
     *      {
     *          "code": xxx,
     *          "message": xxx,
     *          "status": xxx,
     *          "statusText": xxx,
     *          "_error": true
     *      }
     *      ```
     *
     * 追加错误信息到界面，多一个键值`alert`处理（自定义错误信息表）
     *
     * @memberOf module:development/zone
     * @method fxCatch
     * @param errorFn {Function|Object} 附加Error的执行函数，用于执行二义性处理
     * @param reference 当前组件引用
     * @returns {Function} 返回一个函数
     */
    fxCatch: (reference, errorFn = error => error) => {
        if (!reference) {
            console.error("对不起，fxCatch的 reference 参数必须传入");
        }
        return (exception) => {
            if (!exception.data) {
                exception.data = {};
            }
            let alert = {};
            if (__Zn.isFunction(errorFn)) {
                // Function
                alert = errorFn(exception);
            } else {
                // Non-Function
                alert = errorFn;
            }
            exception.data.alert = alert;
            if (reference) {
                // Input setState
                const state = {};
                state.error = exception;
                __Zn.of(reference).in(state).done();
                // reference.?etState(state);
            }
        }
    },


    /**
     * ## 「标准」`Ux.E.fxReject`
     *
     * 容错专用函数，直接通过 code 来抓取内部定义错误信息的 Promise.reject 处理，主要用于执行
     * 异步模式下的 reject 操作，和Promise中的 reject 操作来绑定。
     *
     * @memberOf module:development/zone
     * @method fxReject
     * @async
     * @param {Number} code 错误编号，内部定义。
     * @return {Promise<T>} 返回拒绝过后的内容。
     */
    fxReject: __Zn.fxReject,
}