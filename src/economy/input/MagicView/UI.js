import React from 'react';
import './Cab.less';
import {Input} from 'antd';
import Ux from 'ux';
import Rdr from './I.render';
import moment from 'moment';

const rxContent = (reference, value, config) => {
    /* 默认全走标签 */
    if (Ux.isArray(value)) {
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
        if (moment.isMoment(value)) {
            return Rdr.jsxMoment(reference, value, config);
        } else if (config.items) {
            return Rdr.jsxItems(reference, value, config);
        } else if (config.record) {
            return Rdr.jsxRecord(reference, value, config);
        } else if (config.user) {
            return Rdr.jsxUser(reference, value, config);
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
                literal = Ux.formatExpr(config.expr, {value: input}, true);
            } else if (config.currency) {
                // 判断 currency 配置
                if ("string" === typeof config.currency) {
                    // 默认左单位
                    literal = `${config.currency}${Ux.formatCurrency(literal)}`;
                } else if (Ux.isObject(config.currency)) {
                    const {unit = "￥", right = false} = config.currency;
                    if (right) {
                        // 右边单位
                        literal = `${Ux.formatCurrency(literal)}${unit}`;
                    } else {
                        // 左边单位
                        literal = `${unit}${Ux.formatCurrency(literal)}`;
                    }
                }
            }
        }
        return literal;
    }
    if (Ux.isArray(value)) {
        formatted = value.map(each => fnExpr(each));
    } else {
        formatted = fnExpr(value);
    }
    return formatted;
}
const rxValue = (reference, value, config) => {
    if (config.boolean) {
        if (!value) {
            // 布尔值优先
            return rxContent(reference, false, config);
        }
    } else {
        if (value) {
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
        if (Ux.isArray(value)) {
            const normalized = [];
            value.map(each => Ux.valueTime(each, $config.format))
                .forEach(each => normalized.push(each));
            $value = normalized;
        } else {
            $value = Ux.valueTime(value, $config.format);
        }
    }
    return $value;
}

/*
 * 纯渲染，不带任何 state
 * 也不会出现改变相关操作，纯逻辑
 */
class Component extends React.PureComponent {

    render() {
        const {value, config, format, ...jsx} = this.props;
        // 是否一个Radio
        const $config = Ux.clone(config);
        if (format) {
            // Overwrite Here
            $config.format = format;
        }
        // 时间格式
        const $value = yoValue(this, $config);
        return (
            <Input.Group {...jsx} className={"magic-view-item"}>
                {rxValue(this, $value, $config)}
            </Input.Group>
        );
    }
}

export default Component;