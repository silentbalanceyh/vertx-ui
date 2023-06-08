import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';

const Cv = __Zn.Env;
const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    CURRENCY: (reference, column) => {
        let attrs = Cmn.normInit(column);                                  // -1. 风格可静态化
        if (column[Cv.K_NAME.EXPR]) delete column[Cv.K_NAME.EXPR];                            // -2. 必须删除 $expr
        return (text, record) => {
            attrs = __Zn.clone(attrs);
            let normalizedText = Cmn.normText(text, column, record);       // 1.格式化文字
            if (undefined === normalizedText) {                                 // 2.设置单位信息
                normalizedText = 0
            }
            const $config = column[Cv.K_NAME.CONFIG] ? column[Cv.K_NAME.CONFIG] : {};
            const unit = $config.unit ? $config.unit : Cv.K_VALUE.YUAN;
            const after = !!$config.after;
            normalizedText = __Zn.formatCurrency(normalizedText);                  // 3. 格式化货币
            if (unit) {
                if (after) {                                                    // 4. 前后计算单位
                    normalizedText = `${normalizedText}${unit}`;
                } else {
                    normalizedText = `${unit}${normalizedText}`;
                }
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        }
    },
}