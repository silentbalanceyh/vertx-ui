import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';

const Cv = __Zn.Env;
const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    FILE_SIZE: (reference, column) => {
        let attrs = Cmn.normInit(column);                                          // -1. 风格可静态化
        if (column[Cv.K_NAME.EXPR]) delete column[Cv.K_NAME.EXPR];                                    // -2. 必须删除 $expr
        return (text, record) => {
            attrs = __Zn.clone(attrs);
            let normalizedText = Cmn.normText(text, column, record);               // 1.格式化文字
            if (normalizedText) {
                normalizedText = __Zn.toFileSize(text);                                   // 2.格式化
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        }
    },
}