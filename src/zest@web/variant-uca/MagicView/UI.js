import React from 'react';
import Rdr from './Web';
import __Zn from '../zero.uca.dependency';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "MagicView";
const rxContent = (reference, value, config) => {
    /* 默认全走标签 */
    if (__Zn.isArray(value)) {
        const className = config.vertical ? "ul-item-v" : "ul-item-h"
        return (
            <ul className={className}>
                {value.map((each, index) => {
                    const {id} = reference.props;
                    return (
                        <li key={`${id}${index}`}>{rxContent(reference, each, config)}</li>
                    )
                })}
            </ul>
        )
    } else {
        if (__Zn.isMoment(value)) {
            return Rdr.jsxMoment(reference, value, config);
        } else if (config.items) {
            return Rdr.jsxItems(reference, value, config);
        } else if (config.record) {
            return Rdr.jsxRecord(reference, value, config);
        } else if (config.user) {
            return Rdr.jsxUser(reference, value, config);
        } else if (config.download) {
            return Rdr.jsxDownload(reference, value, config);
        }
        return Rdr.jsxLabel(reference, value, config);
    }
};

const rxExpr = (reference, value, config) => {
    // 执行初始化
    let formatted;
    const fnExpr = (input) => {
        let literal = input;
        if (!config.table) {
            if (config.expr) {
                // 只有配置了格式化的才可以如此，并且不能是表格模式
                literal = __Zn.formatExpr(config.expr, {value: input}, true);
            } else if (config.currency) {
                // 判断 currency 配置
                if ("string" === typeof config.currency) {
                    // 默认左单位
                    literal = `${config.currency}${__Zn.formatCurrency(literal)}`;
                } else if (__Zn.isObject(config.currency)) {
                    const {unit = "￥", right = false} = config.currency;
                    if (right) {
                        // 右边单位
                        literal = `${__Zn.formatCurrency(literal)}${unit}`;
                    } else {
                        // 左边单位
                        literal = `${unit}${__Zn.formatCurrency(literal)}`;
                    }
                }
            }
        }
        return literal;
    }
    if (__Zn.isArray(value)) {
        formatted = value.map(each => fnExpr(each));
    } else {
        formatted = fnExpr(value);
    }
    return formatted;
}
const rxValue = (reference, value, config) => {
    if (config.boolean) {
        if (value) {
            // 布尔值优先
            return rxContent(reference, true, config);
        } else {
            // 包含了 undefined
            return rxContent(reference, false, config);
        }
    } else {
        if (undefined !== value) {
            // 有值
            const formatted = rxExpr(reference, value, config);
            if (config.table) {
                // 排除表格
                return Rdr.jsxTable(reference, formatted, config);
            } else {
                // 非表格模式
                return rxContent(reference, formatted, config);
            }
        } else {
            /* 如果值为undefined或其他，则直接不呈现 */
            return false;
        }
    }
}
/*
 * moment 执行初始化必备
 */
const yoValue = (reference, $config) => {
    const {value} = reference.props;
    // 时间格式
    let $value = value;
    const {moment = false} = reference.props;
    if (moment && value) {
        if (__Zn.isArray(value)) {
            const normalized = [];
            value.map(each => __Zn.valueDatetime(each, $config.format))
                .forEach(each => normalized.push(each));
            $value = normalized;
        } else {
            $value = __Zn.valueDatetime(value, $config.format);
        }
    }
    return $value;
}
// =====================================================
// componentInit/componentUp
// =====================================================
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    render() {
        const {value, config, format, className, ...jsx} = this.props;
        // 是否一个Radio
        const $config = __Zn.clone(config);
        if (format) {
            // Overwrite Here
            $config.format = format;
        }
        // 时间格式
        const $value = yoValue(this, $config);
        const WebField = __Zn.V4InputGroup;
        const attrUca = Sk.mixUca("MagicView", null, {className})
        return (
            <WebField {...jsx} {...attrUca}>
                {rxValue(this, $value, $config)}
            </WebField>
        );
    }
}

export default Component;