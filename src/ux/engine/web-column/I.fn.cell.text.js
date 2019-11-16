import Cmn from "./I.common";
import Abs from "../../abyss";

export default (reference, config = {}) => {
    /*
     * -1. 风格可静态化
     */
    let attrs = Cmn.normalizeInit(config);
    return (text, record) => {
        attrs = Abs.clone(attrs);
        /*
         * 1.格式化文字
         **/
        let normalizedText = Cmn.normalizeText(text, config, record);
        if (normalizedText) {
            /*
            * 2.带省略号文字专用处理
            */
            Cmn.normalizeOverflow(attrs, config);
        }
        return Cmn.jsxSpan(attrs, normalizedText);
    }
}