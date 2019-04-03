import React, {Fragment} from "react";
import {Button, Divider, Popconfirm, Tooltip} from "antd";
import U from 'underscore';
import Value from '../../Ux.Value';

const aiCellOp = (reference, config) => (text, record) => {
    const option = config['$option'];
    if (option) {
        let counter = 0;
        // 编辑按钮
        let edit = _editConfig(option, record);
        if (edit) counter++;
        // 删除按钮
        let removed = _deleteConfig(option, record);
        if (removed) counter++;
        const {
            rxEdit = () => {
            },
            rxDelete = () => {
            }
        } = reference.props;
        // 是否有插件
        const {plugin} = option;
        const {rxPlugin = {}} = reference.props;
        let fnPlugin;
        if (plugin && U.isFunction(rxPlugin[plugin])) {
            fnPlugin = rxPlugin[plugin];
        }
        return (
            <Fragment>
                {edit ? (
                    <a key={edit.key} onClick={(event) => {
                        event.preventDefault();
                        rxEdit(reference, text);
                    }}>{edit.text}</a>) : false}
                {2 === counter ? (
                    <Divider type="vertical"/>) : false}
                {removed ? (
                    <Popconfirm
                        title={option['delete-confirm']}
                        onConfirm={(event) => {
                            event.preventDefault();
                            rxDelete(reference, text);
                        }}>
                        <a key={removed.key}>{removed.text}</a>
                    </Popconfirm>) : false}
                {fnPlugin ? fnPlugin(record, option) : false}
            </Fragment>
        );
    } else return false;
};
const _editConfig = (option = {}, record) => {
    let edit;
    if (option.edit) {
        edit = {};
        edit.key = `edit${record.key}`;
        edit.icon = "edit";
        edit.text = option.edit;
    }
    return edit;
};
const _deleteConfig = (option = {}, record) => {
    let removed;
    // record中的特殊属性lock：锁定的记录不能执行删除（暂时定义active和lock两个属性为记录特有）
    if (option.delete && !record['lock']) {
        removed = {};
        removed.key = `delete${record.key}`;
        removed.icon = "delete";
        removed.text = option.delete;
    }
    return removed;
};
const _rowAddConfig = (option = {}, record) => {
    let rowAdded = {};
    if (option.row) {
        rowAdded = {};
        const textes = option.row;
        const save = {};
        save.key = `save${record.key}`;
        save.icon = `save`;
        save.text = textes[0];
        rowAdded.save = save;
        const cancel = {};
        cancel.key = `undo${record.key}`;
        cancel.icon = `undo`;
        cancel.text = textes[1];
        rowAdded.cancel = cancel;
    }
    return rowAdded;
};
const aiCellButton = (reference, config) => (text, record, index) => {
    const option = config['$option'];
    if (option) {
        // 编辑按钮
        let edit = _editConfig(option, record);
        // 删除按钮
        let removed = _deleteConfig(option, record);
        // 当前行处理
        let rowAdded = _rowAddConfig(option, record);
        // 快速添加按钮
        const {
            rxEdit = () => {
            },
            rxDelete = () => {
            },
            rowKey,
            rxCancel,
            rxSave,
        } = reference.props;
        const {save, cancel} = rowAdded;
        return rowKey === record.key ? (
            <Button.Group>
                {save ? (<Tooltip title={save.text ? save.text : false}>
                    <Button key={save.key} icon={save.icon} onClick={event => {
                        event.preventDefault();
                        if (U.isFunction(rxSave)) rxSave(reference, text, record);
                    }}/>
                </Tooltip>) : false}
                {cancel ? (<Tooltip title={cancel.text ? cancel.text : false}>
                    <Button key={cancel.key} icon={cancel.icon} onClick={event => {
                        event.preventDefault();
                        // 直接运行
                        if (U.isFunction(rxCancel)) rxCancel();
                    }}/>
                </Tooltip>) : false}
            </Button.Group>
        ) : (
            <Button.Group>
                {edit ? (<Tooltip title={edit.text ? edit.text : false}>
                    <Button key={edit.key} icon={edit.icon} onClick={event => {
                        event.preventDefault();
                        rxEdit(reference, text, record);
                    }}/>
                </Tooltip>) : false}
                {removed ? (
                    <Popconfirm title={option['delete-confirm']} onConfirm={(event) => {
                        event.preventDefault();
                        rxDelete(reference, text, record);
                    }}><Button key={removed.key} icon={removed.icon} type={"danger"}/>
                    </Popconfirm>) : false}
            </Button.Group>
        );
    } else return false;
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
                        : Value.clone(line);
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
                    <Divider type="vertical"
                             key={`${item}${opIndex}`}/>
                ) : item.confirm ? (
                    <Popconfirm
                        key={item.key} {...item.confirm}>
                        <a>{item.text}</a>
                    </Popconfirm>
                ) : (
                    <a key={item.key}
                       onClick={item.onClick}>
                        {item.text}
                    </a>
                );
            })}
        </Fragment>
    );
};
export default {
    BUTTON: aiCellButton,
    OP: aiCellOp,
    LINK: aiCellLink,
};