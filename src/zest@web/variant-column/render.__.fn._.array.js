import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';

const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    ARRAY: (reference, config = {}) => {
        let attrs = Cmn.normInit(config);                                      // -1. 风格可静态化
        return (text, record) => {
            attrs = __Zn.clone(attrs);
            if (__Zn.isArray(text)) {                                                // 1.格式化文字
                text = text.join(" | ");
            }
            let normalizedText = Cmn.normText(text, config, record);
            if (normalizedText) {
                Cmn.normOverflow(attrs, config);                               // 2.带省略号文字专用处理
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        }
    },
}