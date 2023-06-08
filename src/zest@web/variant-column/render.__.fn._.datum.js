import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';
import {_Ant} from "zo";

const Cmn = {
    ...__JSX,
    ...__NORM,
}

const __aiAdorn = (config = {}, record = {}, reference) => {
    const {adorn} = config;
    if (adorn) {
        const {field, items = {}} = adorn;
        if (field) {
            const iconExpr = items[record[field]];
            if (iconExpr) {
                const parsed = iconExpr.split(',');
                if (3 === parsed.length) {
                    const iconData = {};
                    iconData.icon = parsed[0];
                    iconData.iconStyle = {};
                    iconData.iconStyle.fontSize = parsed[1] ? parsed[1] : 14;
                    if (parsed[2]) {
                        iconData.iconStyle.color = parsed[2];
                    }
                    return iconData;
                }
            }
        }
    }
}
export default {
    DATUM: (reference, column = {}) => {
        let attrs = Cmn.normInit(column);                                              // -1. 风格可静态化
        const normalized = _Ant.toUnique(reference, column);                               // -2. 处理 normalized 解析 $datum 的相关处理
        const {data = [], config = {}} = normalized;
        const {display, value} = config;
        return (text) => {
            attrs = __Zn.clone(attrs);
            let normalizedText;                                                             // 1. 解析 display, value
            let iconData;
            if (__Zn.isArray(text)) {
                // 多值
                const result = text
                    .map(item => __Zn.elementUnique(data, value, item))
                    .map(item => __Zn.valueExpr(display, item, true));
                normalizedText = result.join(' | ');
            } else {
                // 单值
                const item = __Zn.elementUnique(data, value, text);                          // 单值
                if (item) {
                    const adornCfg = column.$config ? column.$config : {};                  // 只有查找对了单值的时候才执行该操作 解析 adorn 执行图标处理
                    iconData = __aiAdorn(adornCfg, item);
                    normalizedText = __Zn.valueExpr(display, item, true);
                } else {
                    const {$empty} = column;
                    if ($empty) {
                        normalizedText = $empty;
                    } else {
                        normalizedText = false;
                    }
                }
            }
            return Cmn.jsxIcon(attrs, normalizedText, iconData);
        }
    },
}