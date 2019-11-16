import Cmn from "./I.common";
import Abs from '../../abyss';
import U from 'underscore';

export default (reference, config = {}) => (text, record = {}) => {
    /*
     * 提取特殊变量 $dict
     */
    const {$dict = {}} = reference.props;
    const attrs = {};
    if (Abs.isEmpty($dict)) {
        attrs.style = {color: "red"};
        return Cmn.jsxSpan(attrs, "ERROR");
    } else {
        const {$config = {}} = config;
        const fieldName = $config.field ? $config.field : "name";
        /*
         * 读取 Source
         * field <- record <- $dict（两层穿透）
         */
        const ref = $dict[record[fieldName]];
        if (!ref) {
            return Cmn.jsxSpan(attrs, text);
        } else {
            let normalized;
            if (U.isFunction(ref)) {
                normalized = ref(text, record);
            } else {
                normalized = ref[text];
            }
            if (normalized) {
                if (U.isObject(normalized)) {
                    normalized = normalized.display;
                }
                return Cmn.jsxSpan(attrs, normalized);
            } else {
                /*
                 * 维持原始值
                 */
                return Cmn.jsxSpan(attrs, text);
            }
        }

    }
}