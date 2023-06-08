import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';

const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    DICT: (reference, column = {}) => (text, record = {}) => {
        const {$dict = {}} = reference.props;                               // 提取特殊变量 $dict
        const attrs = {};
        if (__Zn.isEmpty($dict)) {
            attrs.style = {color: "red"};
            return Cmn.jsxSpan(attrs, "ERROR");
        } else {
            const {$config = {}} = column;
            const fieldName = $config.field ? $config.field : "name";
            const ref = $dict[record[fieldName]];                           // 读取 Source field <- record <- $dict（两层穿透）
            if (!ref) {
                return Cmn.jsxSpan(attrs, text);
            } else {
                let normalized;
                if (__Zn.isFunction(ref)) {
                    normalized = ref(text, record);
                } else {
                    normalized = ref[text];
                }
                if (normalized) {
                    if (__Zn.isObject(normalized)) {
                        normalized = normalized.display;
                    }
                    return Cmn.jsxSpan(attrs, normalized);
                } else {
                    return Cmn.jsxSpan(attrs, text);
                }
            }

        }
    },
}