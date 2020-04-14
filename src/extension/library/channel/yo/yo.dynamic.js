import yoAmbient from "./yo.ambient";
import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 动态扩展配置，前置调用`yoAmbient`方法处理统一配置，然后追加配置：
 *
 * 1. 追加 $identifier 统一标识符（这里是计算过后的标识符）
 * 2. 追加 $controls 控件配置信息
 * 3. 初始化数据 $inited 专用
 * 4. 专用配置 $mode 模式处理
 *
 * @memberOf module:_channel
 * @method yoDynamic
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
export default (reference = {}) => {
    const attrs = yoAmbient(reference);
    const {
        $identifier, $controls = {}, $inited,
        $mode, $fabric = {}
    } = reference.props;
    if ($identifier) {
        /*
         * 动态选择模型专用标识符
         */
        attrs.$identifier = $identifier;
    }
    if (!Ux.isEmpty($controls)) {
        /*
         * 动态控件专用配置信息
         */
        attrs.$controls = $controls;
    }
    if ($inited) {
        /*
         * 表单专用初始化数据相关信息
         * 1）先走 state 中的 $inited
         * 2）再走 props 中的 $inited
         */
        let inited = reference.state ? reference.state.$inited : null;
        if (Ux.isEmpty(inited)) {
            attrs.$inited = $inited;
        } else {
            /*
             * 状态中的 inited，和 rxView 配合
             */
            const {rxView} = reference.props;
            if (Ux.isFunction(rxView)) {
                /* 动态处理 */
                attrs.rxView = (key) => rxView(key).then(data =>
                    reference.setState({$inited: data}));
            }
            attrs.$inited = inited;
        }
    }
    if ($mode) {
        /*
         * 表单专用信息
         */
        attrs.$mode = $mode;
    }
    if ($fabric) {
        /*
         * 状态处理
         */
        attrs.$fabric = $fabric;
    }
    return attrs;
}