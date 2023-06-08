import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';

const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {

    LOGICAL: (reference, column = {}) => {
        let attrs = Cmn.normInit(column);                                          // -1. 风格可静态化
        const {$mapping = {}} = column;                                                 // -2. 静态部分，先解析 $mapping 并且只解析一次
        const parsed = {};
        Object.keys($mapping)
            .forEach(key => parsed[key] = __Zn.aiExprIcon($mapping[key]));
        return (originalText, record = {}) => {
            attrs = __Zn.clone(attrs);
            const item = originalText ? parsed["true"] : parsed["false"];               // 1. 根据值提取 item
            const normalizedIcon = Cmn.normIcon(item);                             // 2. icon 的规范化
            const normalizedText = Cmn.normText(item.text, column, record);        // 3.格式化文字
            return Cmn.jsxIcon(attrs, normalizedText, normalizedIcon)
        }
    },
}