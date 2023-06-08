import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';

const Cv = __Zn.Env;
const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    DATE: (reference, column) => {
        let attrs = Cmn.normInit(column);                                          // -1. 风格可静态化
        if (column[Cv.K_NAME.EXPR]) delete column[Cv.K_NAME.EXPR];                                    // -2. 必须删除 $expr
        return (text, record) => {
            attrs = __Zn.clone(attrs);
            let normalizedText = Cmn.normText(text, column, record);               // 1.格式化文字
            if (normalizedText && text) {
                let format = column[Cv.K_NAME.FORMAT];
                if (!format) {
                    const {$config = {}} = column;
                    format = $config[Cv.K_NAME.FORMAT];                                         // 新版专用
                }
                normalizedText = __Zn.formatDate(normalizedText, format);                  // 2.格式化
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        };
    },
}