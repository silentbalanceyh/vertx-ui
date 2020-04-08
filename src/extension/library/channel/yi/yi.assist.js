import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 注入 Assist 专用数据辅助信息，读取资源文件中的配置：
 *
 * ```json
 * {
 *     "_assist": {
 *     }
 * }
 * ```
 *
 * 读取辅助数据专用清单。
 *
 * @memberOf module:_channel
 * @method yiAssist
 * @param {ReactComponent} reference React对应组件引用
 * @param {State} state 返回当前组件状态
 * @returns {Promise<T>} 执行更新过后的状态
 */
export default (reference, state = {}) => {
    /*
     * Assist 专用数据
     */
    const assist = Ux.fromHoc(reference, "assist");
    /*
     * keys / promise
     */
    if (assist) {
        /*
         * 第一选择
         */
        return Ux.asyncAssist(assist, reference, state);
    } else {
        const {config = {}} = reference.props;
        if (config.assist) {
            /*
             * 第二选择
             */
            return Ux.asyncAssist(config.assist, reference, state);
        } else return Ux.promise(state);
    }
}