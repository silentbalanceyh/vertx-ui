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
         * 2.设置单位信息
         */
        if (normalizedText) {
            const $config = config["$config"] ? config["$config"] : {};
            const unit = $config.unit ? $config.unit : "￥";
            const after = !!$config.after;
            /*
             * 3. 格式化货币
             */
            normalizedText = Ut.formatCurrency(normalizedText);
            if (unit) {
                /*
                 * 4. 前后计算单位
                 */
                if (after) {
                    normalizedText = `${normalizedText}${unit}`;
                } else {
                    normalizedText = `${unit}${normalizedText}`;
                }
            }
        }
        return Cmn.jsxSpan(attrs, normalizedText);
    }
}