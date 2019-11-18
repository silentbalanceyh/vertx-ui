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
    attrs.reference = reference;
    return (text, record) => {
        attrs = Abs.clone(attrs);
        /*
         * 1.格式化文字
         **/
        let normalizedText = Cmn.normalizeText(text, config, record);
        if (normalizedText) {
            /*
             * 2.链接专用处理
             */
            const $config = config["$config"] ? config["$config"] : {};
            if ($config.url) {
                attrs.url = Ut.formatExpr($config.url, record, true);
            }
            /*
             * 3.Overflow
             */
            Cmn.normalizeOverflow(attrs, config);
        }
        return Cmn.jsxHyper(attrs, normalizedText);
    }
}