import React, {Fragment} from "react";
import {Divider, Popconfirm} from "antd";
import Ux from "ux";
import Immutable from "immutable";

/**
 * 【高阶函数：二阶】列render方法处理器，用于处理双值
 * * 配置键：LOGICAL
 * * true/false对应不同的双值，以及不同值呈现值
 * * 附加配置项中包含$mapping用于描述双值配置
 * @method aiCellLogical
 * @private
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} config 单列配置数据
 * @return {function(*): *}
 * @example
 *
 *      ...
 *      {
 *          "title": "房包早",
 *          "dataIndex": "brekker",
 *          "$render": "LOGICAL",
 *          "$mapping": {
 *              "true": "是",
 *              "false": "否"
 *          }
 *      }
 */
const aiCellLogical = (reference, config = {}) => text => {
    const {$mapping = {}} = config;
    return (<span>{text ? $mapping["true"] : $mapping["false"]}</span>)
};

/**
 * 【高阶函数：二阶】列render方法处理器，用于处理带百分号（%）的字符串格式化
 * * 配置值：PERCENT
 * @method aiCellPercent
 * @private
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} config 单列配置数据
 * @return {function(*=): *}
 */
const aiCellPercent = (reference, config) => text => {
    return (
        <span>{Ux.fmtPercent(text)}</span>
    )
};
/**
 * 【高阶函数：二阶】列render方法处理器，用于处理时间格式化
 * * 配置值：DATE
 * * 附加配置中包含$format用于描述moment的格式Pattern
 * @method aiCellDate
 * @private
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} config 单列配置数据
 * @return {function(*=): *}
 * @example
 *
 *      ...
 *      {
 *          "title": "抵达日期",
 *          "dataIndex": "arriveTime",
 *          "$render": "DATE",
 *          "$format": "YYYY年MM月DD日 HH:mm:ss"
 *      }
 */
const aiCellDate = (reference, config) => text => {
    return <span>{Ux.formatDate(text, config.$format)}</span>;
};
/**
 * 【高阶函数：二阶】列render方法处理器，用于处理货币格式化
 * * 配置值：CURRENCY
 * * 附加配置中包含$flag用于描述货币符号，默认为￥
 * @method aiCellCurrency
 * @private
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} config 单列配置数据
 * @return {function(*=): *}
 * @example
 *
 *      ...
 *      {
 *          "title": "单价",
 *          "dataIndex": "unitPrice",
 *          "$render": "CURRENCY"
 *      },
 */
const aiCellCurrency = (reference, config = {}) => text => {
    const flag = config.$flag ? config.$flag : "￥";
    return <span>{flag}{Ux.fmtCurrency(text)}</span>;
};
/**
 * 【高阶函数：二阶】列render方法处理函数，用于处理表达式格式化
 * * 配置项：EXPRESSION
 * * 附加配置$expr用于描述表达式，表达式中的占位符使用`:value`的格式
 * @method aiCellExpression
 * @private
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} config 单列配置数据
 * @return {function(*=): *}
 * @example
 *
 *      ...
 *      {
 *          "title": "入住天数",
 *          "dataIndex": "insideDays",
 *          "$render": "EXPRESSION",
 *          "$expr": ":value天"
 *      }
 */
const aiCellExpression = (reference, config) => text => {
    return <span>{Ux.formatExpr(config.$expr, {value: text})}</span>;
};
/**
 * 【高阶函数：二阶】列render方法处理函数，用于处理Datum类型：Tabular/Assist专用格式化
 * * 配置项：DATUM
 * * 附加配置项：$datum用于描述关联的信息，source = key, value和display对应值和呈现字段
 * @method aiCellDatum
 * @private
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} config 单列配置数据
 * @return {function(*=): *}
 * @example
 *
 *      ...
 *      {
 *          "title": "会计科目",
 *          "dataIndex": "accountId",
 *          "$render": "DATUM",
 *          "$datum": {
 *              "source": "account.item",
 *              "value": "category",
 *              "display": "name"
 *          }
 *      }
 */
const aiCellDatum = (reference, config) => text => {
    const datum = config.$datum;
    const data = Ux.onDatum(reference, datum.source);
    const item = Ux.elementUnique(data, datum.value, text);
    return <span>{item ? item[datum.display] : false}</span>;
};
/**
 * 【高阶函数：二阶】列render方法处理函数，用于处理Link类型：带操作的链接类型
 * * 配置值：LINK
 * * 附加配置想对复杂，用于处理操作链接，数组$config用于描述当前操作按钮
 *      * 如果是divider的字符串则直接渲染分隔符（无操作）；
 *      * 如果包含了dialogKey则表示当前按钮触发过后会显示dialog窗口；
 *      * 如果包含了confirm，则会启用提示操作；
 *      * 如果包含onClick则使用onClick生成确认函数，关联到Dialog中的Yes；如果包含confirm，则confirm就是窗口函数，onConfirm充当不带confirm时的onClick二阶函数；
 * @method aiCellLink
 * @private
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} config 单列配置数据
 * @param ops 可传入的二阶函数，用于生成新的Click函数
 * @return {function(*=): *}
 * @example
 *
 *      ...
 *      {
 *          "title": "操作",
 *          "dataIndex": "key",
 *          "fixed": "left",
 *          "$render": "LINK",
 *          "$config": [
 *              {
 *                  "key": "btnEdit",
 *                  "text": "编辑",
 *                  "dialogKey": "dgEdit",
 *                  "onClick": "fnEdit"
 *              },
 *              "divider",
 *              {
 *                  "key": "btnDelete",
 *                  "text": "删除",
 *                  "dataPath": "list.items",
 *                  "confirm": {
 *                      "title": "确认删除当前入住人？",
 *                      "okText": "是",
 *                      "cancelText": "否",
 *                      "onConfirm": "fnRemove"
 *                  }
 *              }
 *          ]
 *      }
 */
const aiCellLink = (reference, config, ops = {}) => text => {
    return (
        <Fragment>
            {config['$config'].map((line, opIndex) => {
                // 编辑专用，配置信息需要拷贝，才可不同
                const item =
                    "string" === typeof line
                        ? line
                        : Immutable.fromJS(line).toJS();
                // 按钮onClick专用
                if (item.onClick) {
                    const fn = ops[item.onClick];
                    if (fn)
                        item.onClick = fn(reference, item.dialogKey)(
                            line,
                            text
                        );
                }
                // Confirm窗口中的Yes
                if (item.confirm && item.confirm.onConfirm) {
                    const fn = ops[item.confirm.onConfirm];
                    if (fn) item.confirm.onConfirm = fn(reference)(line, text);
                }
                return "string" === typeof item ? (
                    <Divider type="vertical" key={`${item}${opIndex}`}/>
                ) : item.confirm ? (
                    <Popconfirm key={item.key} {...item.confirm}>
                        <a>{item.text}</a>
                    </Popconfirm>
                ) : (
                    <a key={item.key} onClick={item.onClick}>
                        {item.text}
                    </a>
                );
            })}
        </Fragment>
    );
};
export default {
    aiCellLogical,
    aiCellCurrency,
    aiCellDate,
    aiCellLink,
    aiCellExpression,
    aiCellDatum,
    aiCellPercent
}