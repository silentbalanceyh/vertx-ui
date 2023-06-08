import __Zn from "./zero.uca.dependency";

const Cv = __Zn.Env;
export default {
    normInit: (config, keys = []) => {
        const attrs = {};
        __Zn.valueCopy(attrs, config, [
            "className",
            "style"
        ].concat(keys));
        return attrs;
    },
    /* normalizeText */
    normText: (text, config, record) => {
        let normalizedText = text;
        if (normalizedText) {
            /*
            * 1.1. 第一处理 $expr 表达式，由于使用了表达式
            * 证明当前值需要最终处理 $expr 的核心内容，前提是 text 有值
            */
            const expression = config[Cv.K_NAME.EXPR];
            if (expression && "string" === typeof expression) {
                /*
                 * 表达式条件
                 * 1. 配置了 $expr
                 * 2. $expr 的类型是 String 字符串
                 * 3. 追加 value 到新的 record 中用于处理 :value 的表达式，还可处理其他表达式
                 */
                const original = __Zn.clone(record);
                original.value = text;
                normalizedText = __Zn.formatExpr(expression, original, true);
            }
        } else {
            /*
             * 1.2. 只有无值的时候，$empty 才有用
             */
            const empty = config[Cv.K_NAME.EMPTY];
            if (empty && "string" === typeof empty) {
                normalizedText = config[Cv.K_NAME.EMPTY];
            }
        }
        return normalizedText;
    },
    /* normalizeIcon */
    normIcon: (item = {}) => {
        let iconAttrs = {};
        __Zn.valueCopy(iconAttrs, item, ["icon", "iconStyle"]);
        if (iconAttrs.icon) {
            if (!iconAttrs.iconStyle) {
                iconAttrs.iconStyle = {};
            }
            const iconRef = iconAttrs.iconStyle;
            if (iconRef.hasOwnProperty('fontSize')) {
                iconRef.fontSize = __Zn.valueInt(iconRef.fontSize, 14);
            }
        }
        return __Zn.isEmpty(iconAttrs) ? undefined : iconAttrs;
    },
    /* 长文本处理 */
    normOverflow: (attrs = {}, config = {}) => {
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