import Ele from "../../element";
import Abs from '../../abyss';
import Ut from '../../unity';
import Jsx from './I.common.jsx.js';

export default {
    ...Jsx,
    normalizeInit: (config, keys = []) => {
        const attrs = {};
        Ele.valueCopy(attrs, config, [
            "className",
            "style"
        ].concat(keys));
        return attrs;
    },
    /* normalizeText */
    normalizeText: (text, config, record) => {
        let normalizedText = text;
        if (normalizedText) {
            /*
            * 1.1. 第一处理 $expr 表达式，由于使用了表达式
            * 证明当前值需要最终处理 $expr 的核心内容，前提是 text 有值
            */
            const expression = config["$expr"];
            if (expression && "string" === typeof expression) {
                /*
                 * 表达式条件
                 * 1. 配置了 $expr
                 * 2. $expr 的类型是 String 字符串
                 * 3. 追加 value 到新的 record 中用于处理 :value 的表达式，还可处理其他表达式
                 */
                const original = Abs.clone(record);
                original.value = text;
                normalizedText = Ut.formatExpr(expression, original, true);
            }
        } else {
            /*
             * 1.2. 只有无值的时候，$empty 才有用
             */
            const empty = config["$empty"];
            if (empty && "string" === typeof empty) {
                normalizedText = config["$empty"];
            }
        }
        return normalizedText;
    },
    /* normalizeIcon */
    normalizeIcon: (item = {}) => {
        let iconAttrs = {};
        Ele.valueCopy(iconAttrs, item, ["icon", "iconStyle"]);
        if (iconAttrs.icon) {
            if (!iconAttrs.iconStyle) {
                iconAttrs.iconStyle = {};
            }
            const iconRef = iconAttrs.iconStyle;
            if (iconRef.hasOwnProperty('fontSize')) {
                iconRef.fontSize = Ele.valueInt(iconRef.fontSize, 14);
            }
        }
        return Abs.isEmpty(iconAttrs) ? undefined : iconAttrs;
    },
    /* 长文本处理 */
    normalizeOverflow: (attrs = {}, config = {}) => {
        /*
         * 2.带省略号文字专用处理
         */
        const {width} = config;
        if (!attrs.style) attrs.style = {};
        if (0 < width) {
            attrs.style.overflow = "hidden";
            attrs.style.whiteSpace = "nowrap";
            attrs.style.textOverflow = "ellipsis";
            attrs.style.maxWidth = width;
            attrs.style.width = width;
            attrs.style.display = "inline-block";  // 必须有内容才会生效
            return true;
        } else {
            return false;
        }
    }
}