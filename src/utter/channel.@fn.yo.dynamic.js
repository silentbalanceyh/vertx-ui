import Ux from 'ux';
import yoAmbient from './channel.@fn.yo.ambient';

export default (reference = {}) => {
    const attrs = yoAmbient(reference);
    const {
        $controls = {}, $inited,
        $mode, $fabric = {}
    } = reference.props;
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
                attrs.rxView = (key) => rxView(key).then(data => {
                    return Ux.of(reference).in({
                        $inited: data
                    }).future(() => Ux.promise(data))
                    // reference.?etState({$inited: data})
                });
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