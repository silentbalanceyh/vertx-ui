import Pr from '../expression';
import Cmn from './I.common';
import Abs from "../../abyss";

export default (reference, config = {}) => {
    /*
     * -1. 风格可静态化
     */
    let attrs = Cmn.normalizeInit(config);
    /*
     * -2. 静态部分，先解析 $mapping
     * 并且只解析一次
     */
    const {$mapping = {}} = config;
    const parsed = {};
    Object.keys($mapping)
        .forEach(key => parsed[key] = Pr.aiExprIcon($mapping[key]));
    return (originalText, record = {}) => {
        attrs = Abs.clone(attrs);
        /*
         * 1. 根据值提取 item
         * {
         *      "text",
         *      "icon",
         *      "iconStyle",
         * }
         */
        const item = originalText ? parsed["true"] : parsed["false"];
        /*
         * 2. icon 的规范化
         */
        const normalizedIcon = Cmn.normalizeIcon(item);
        /*
         * 3.格式化文字
         */
        const normalizedText = Cmn.normalizeText(item.text, config, record);
        return Cmn.jsxIcon(attrs, normalizedText, normalizedIcon)
    }
}