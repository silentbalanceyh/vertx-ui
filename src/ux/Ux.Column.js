import React, {Fragment} from "react";
import {Divider, Popconfirm} from "antd";
import Ux from "ux";
import Immutable from "immutable";

/**
 * 【高阶函数：二阶】列render方法处理器，用于处理双值
 * * 配置键：LOGICAL
 * * true/false对应不同的双值，以及不同值呈现值
 * * 附加配置项中包含$mapping用于描述双值配置
 * @method renderLogical
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
const renderLogical = (reference, config) => text => {
    return (
        <span>{text ? config.$mapping["true"] : config.$mapping["false"]}</span>
    );
};
/**
 * 【高阶函数：二阶】列render方法处理器，用于处理带百分号（%）的字符串格式化
 * * 配置值：PERCENT
 * @method renderPercent
 * @private
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} config 单列配置数据
 * @return {function(*=): *}
 */
const renderPercent = (reference, config) => text => {
    return (
        <span>{Ux.fmtPercent(text)}</span>
    )
};
/**
 * 【高阶函数：二阶】列render方法处理器，用于处理时间格式化
 * * 配置值：DATE
 * * 附加配置中包含$format用于描述moment的格式Pattern
 * @method renderDate
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
const renderDate = (reference, config) => text => {
    return <span>{Ux.formatDate(text, config.$format)}</span>;
};
/**
 * 【高阶函数：二阶】列render方法处理器，用于处理货币格式化
 * * 配置值：CURRENCY
 * * 附加配置中包含$flag用于描述货币符号，默认为￥
 * @method renderCurrency
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
const renderCurrency = (reference, config = {}) => text => {
    const flag = config.$flag ? config.$flag : "￥";
    return <span>{flag}{Ux.fmtCurrency(text)}</span>;
};
/**
 * 【高阶函数：二阶】列render方法处理函数，用于处理表达式格式化
 * * 配置项：EXPRESSION
 * * 附加配置$expr用于描述表达式，表达式中的占位符使用`:value`的格式
 * @method renderExpression
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
const renderExpression = (reference, config) => text => {
    return <span>{Ux.formatExpr(config.$expr, {value: text})}</span>;
};
/**
 * 【高阶函数：二阶】列render方法处理函数，用于处理Datum类型：Tabular/Assist专用格式化
 * * 配置项：DATUM
 * * 附加配置项：$datum用于描述关联的信息，source = key, value和display对应值和呈现字段
 * @method renderDatum
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
const renderDatum = (reference, config) => text => {
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
 * @method renderLink
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
const renderLink = (reference, config, ops = {}) => text => {
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
const RENDERS = {
    LOGICAL: renderLogical,
    DATE: renderDate,
    CURRENCY: renderCurrency,
    EXPRESSION: renderExpression,
    LINK: renderLink,
    DATUM: renderDatum,
    PERCENT: renderPercent
};
/**
 * Ant Design的Table组件专用的专用属性`columns`列处理器，处理每一列的`render`属性
 * @method uiColumnRender
 * @param reference
 * @param columns
 * @param key
 * @param fnRender
 * @param {Boolean} hoc 是否生成函数
 */
const uiColumnRender = (reference, columns = [], key, fnRender = () => false, hoc = false) => {
    columns.forEach(column => {
        if (column.dataIndex && key === column.dataIndex) {
            if (hoc) {
                column.render = fnRender(column);
            } else {
                column.render = fnRender;
            }
        }
    })
};
/**
 * Ant Design的Table组件的Table组件专用属性`columns`列处理器，处理每一列的`render`属性
 * @method uiTableColumn
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Array} columns 当前Table组件的columns配置
 * @param ops 当前列是否可操作列：如列中包含了编辑、删除按钮
 * @return {Array}
 */
const uiTableColumn = (reference, columns = [], ops = {}) => {
    columns.forEach(column => {
        if (column.hasOwnProperty("$render")) {
            const fnRender = RENDERS[column["$render"]];
            if (fnRender) {
                column.render = fnRender(reference, column, ops);
            }
        }
    });
    return columns;
};
/**
 * Ant Design中的Table组件的Table组件专用属性`pagination`处理
 * @method uiTablePager
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} pager 分页对象，包含了`size`和`page`两个属性
 * @param {Number} count 当前分页组件的数据中的记录数
 * @return {Object}
 */
const uiTablePager = (reference, pager = {}, count = 0) => {
    const pagination = {
        showSizeChanger: true,
        showQuickJumper: true
    };
    pagination.total = count;
    pagination.pageSize = pager.size ? pager.size : 10;
    pagination.current = pager.page ? pager.page : 1;
    return pagination;
};
/**
 * 【高阶函数：二阶】Ant Design中的Table组件专用属性`rowSelection`生成函数
 * @method uiTableSelection
 * @param {React.PureComponent} reference React对应组件引用
 * @return {Object}
 */
const uiTableSelection = reference => {
    const {selectedRowKeys = []} = reference.state;
    return {
        selectedRowKeys,
        onChange: keys => {
            // Selected Keys
            reference.setState({selectedRowKeys: keys});
        },
        getCheckboxProps: record => ({
            disabled: record.disabled
        })
    };
};
/**
 * @class Column
 * @description Ant Design中的Table专用系列方法，暂时只有PageList在调用这三个函数，
 * 注意这里的columns必须是`Array`类型用于注入到Table组件
 */
export default {
    uiColumnRender,
    uiTableColumn,
    uiTablePager,
    uiTableSelection
};
