import Cmn from "./I.common";
import Abs from "../../abyss";
import Pr from "../expression";

export default (reference, config) => {
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
        .forEach(key => {
            let processed = key;
            if (0 < key.indexOf('`')) {
                /*
                 * valueLadder 中符号冲突
                 * 1）.号需要转换成 ` 来处理 literal 中的值
                 * 2）因为值中可能包含 . 号
                 */
                const reg = new RegExp("`", "g");
                processed = key.replace(reg, '.');
            }
            parsed[processed] = Pr.aiExprIcon($mapping[key]);
        });
    return (originalText, record) => {
        attrs = Abs.clone(attrs);
        /*
         * 1. 根据值提取 item
         * {
         *      "text",
         *      "icon",
         *      "iconStyle",
         * }
         */
        let item = parsed[originalText];
        if (!item) item = {};
        /*
         * 2. icon 的规范化
         */
        const normalizedIcon = Cmn.normalizeIcon(item);
        /*
         * 3.格式化文字
         */
        const normalizedText = Cmn.normalizeText(item.text, config, record);
        /*
         * 4.合并 item 中的
         */
        if (Abs.isDiff(attrs.style, item.style)) {
            attrs.style = item.style;
        }
        return Cmn.jsxIcon(attrs, normalizedText, normalizedIcon);
    }
}