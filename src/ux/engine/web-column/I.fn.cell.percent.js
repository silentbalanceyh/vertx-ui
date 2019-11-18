import Cmn from "./I.common";
import Abs from "../../abyss";
import Ut from '../../unity';

export default (reference, config) => {
    /*
     * -1. 风格可静态化
     */
    let attrs = Cmn.normalizeInit(config);
    /*
     * -2. 必须删除 $expr
     */
    if (config['$expr']) delete config['$expr'];
    return (text, record) => {
        attrs = Abs.clone(attrs);
        /*
         * 1.格式化文字
         **/
        let normalizedText = Cmn.normalizeText(text, config, record);
        /*
         * 2.格式化
         */
        if (normalizedText) {
            normalizedText = Ut.formatPercent(text);
        }
        return Cmn.jsxSpan(attrs, normalizedText);
    }
}