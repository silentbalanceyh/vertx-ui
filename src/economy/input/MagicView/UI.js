import React from 'react';
import './Cab.less';
import {Input} from 'antd';
import Ux from 'ux';
import Rdr from './Web';
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

/**
 * ## 「组件」`MagicView`
 *
 * 数组录入组件
 *
 * ```js
 * import { MagicView } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * #### 0.1. 时间
 *
 * ```json
 * {
 *      "metadata": "infoAt,记录时间,10,,aiMagic",
 *      "optionJsx.config.format": "YYYY年MM月DD日 HH:mm",
 *      "moment": true
 * }
 * ```
 *
 * #### 0.2. Ajax加载
 *
 * ```json
 * {
 *      "metadata": "logUser,记录人,14,,aiMagic",
 *      "optionJsx.config.user": {
 *          "uri": "/api/user/:key",
 *          "field": "realname"
 *      },
 *      "optionJsx.$empty": "（系统）"
 * }
 * ```
 *
 * #### 0.3. 带图标选项
 *
 * ```json
 * {
 *      "metadata": "level,级别,10,,aiMagic",
 *      "optionJsx.config.items": [
 *          "INFO,信息:info-circle,16:#6495ED",
 *          "WARN,警告:warning,16:#EEB422",
 *          "ERROR,错误:issues-close,16:#EE2C2C"
 *      ]
 * }
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Object|Ant Form给当前组件传入的值。|
 * |format||props|String|时间格式专用格式化的Pattern（开发模式）。|
 * |$empty||props|String|如果数据为空则使用空的字符串呈现。|
 * |config|items|props|Array|静态选项。|
 * |config|datum|props|String/Object|动态选项。|
 * |config|moment|props|Boolean|是否时间格式。|
 * |config|boolean|props|Boolean|是否Boolean类型。|
 * |config|table|props|Object|表格渲染专用配置。|
 * |config|expr|props|String|「特定配置」table不存在时，使用表达式模式。|
 * |config|currency|props|String/Object|「特定配置」table不存在，并且不带expr，则直接使用currency。|
 * |config|format|props|String|时间格式专用格式化的Pattern（配置模式）。|
 * |config|user|props|Object|Ajax配置，原生配置是为创建人、更新人量身打造，所以该配置目前使用`user`。|
 * |config|record|props|Boolean|是否执行记录解析，使用Json模式呈现。|
 * |config|rxRecord|props|Function|记录解析函数，配合record配置使用。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 货币双格式
 *
 * currency有两种格式，默认是字符串，还有下边格式：
 *
 * ```json
 * {
 *     "unit": "货币单位",
 *     "right": "是否位于右侧"
 * }
 * ```
 *
 * * 默认格式：`String`也是这个格式，`<单位><值>`。
 * * right = true：`<值><单位>`。
 *
 * #### 3.2. Icon格式
 *
 * 示例格式：
 *
 * `INFO,信息:info-circle,16:#6495ED`
 *
 * 上述格式转换成：
 *
 * `<值>,<显示文字:图标类型>,<图标尺寸:图标颜色>`
 *
 *
 * @memberOf module:web-input
 * @method MagicView
 */
// =====================================================
// componentInit/componentUp
// =====================================================
class Component extends React.PureComponent {

    render() {
        const {value, config, format, className, ...jsx} = this.props;
        // 是否一个Radio
        const $config = Ux.clone(config);
        if (format) {
            // Overwrite Here
            $config.format = format;
        }
        // 时间格式
        const $value = yoValue(this, $config);
        return (
            <Input.Group {...jsx} className={`web-magic-view ${className ? className : ""}`}>
                {rxValue(this, $value, $config)}
            </Input.Group>
        );
    }
}

export default Component;