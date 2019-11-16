import yoAmbient from "./yo.ambient";
import Ux from 'ux';

export default (reference = {}) => {
    const attrs = yoAmbient(reference);
    const {$identifier, $controls = {}, $inited, $mode} = reference.props;
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
         */
        attrs.$inited = $inited;
    }
    if ($mode) {
        /*
         * 表单专用信息
         */
        attrs.$mode = $mode;
    }
    return attrs;
}