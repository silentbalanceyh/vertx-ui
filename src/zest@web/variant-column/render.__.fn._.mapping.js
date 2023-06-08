import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';

const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    MAPPING: (reference, column) => {
        let attrs = Cmn.normInit(column);                                          // -1. 风格可静态化
        const {$mapping = {}} = column;
        // -2. 静态部分，先解析 $mapping 并且只解析一次
        const parsed = {};
        Object.keys($mapping)
            .forEach(key => {
                let processed = key;
                if (0 < key.indexOf('`')) {
                    // valueLadder 中符号冲突, 1）.号需要转换成 ` 来处理 literal 中的值, 2）因为值中可能包含 . 号
                    const reg = new RegExp("`", "g");
                    processed = key.replace(reg, '.');
                }
                parsed[processed] = __Zn.aiExprIcon($mapping[key]);
            });
        return (originalText, record) => {
            attrs = __Zn.clone(attrs);
            let item = parsed[originalText];                                            // 1. 根据值提取 item
            if (!item) item = {};
            const normalizedIcon = Cmn.normIcon(item);                             // 2. icon 的规范化
            const normalizedText = Cmn.normText(item.text, column, record);        // 3.格式化文字
            if (__Zn.isDiff(attrs.style, item.style)) {                                  // 4.合并 item 中的
                attrs.style = item.style;
            }
            return Cmn.jsxIcon(attrs, normalizedText, normalizedIcon);
        }
    },
}