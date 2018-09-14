import React from 'react'
import {Alert, Button, Col, Drawer, Input, Popconfirm, Row} from 'antd';
import Init from './Op.Init';
import Ux from 'ux';
import U from 'underscore';
import Act from './Op.Action';

const _renderOp = (reference, key, value = "") => {
    if ("add" === key) {
        const button = {};
        button.icon = "plus";
        button.type = "primary";
        button.key = key;
        button.text = value;
        button.onClick = Act.rxAdd(reference);
        return button;
    }
};

const renderOp = (reference) => {
    const options = Init.readOption(reference);
    const ops = {};
    Ux.itObject(options, (field, value) => {
        if (field.startsWith("op")) {
            ops[field.substring(field.indexOf('.') + 1)] = value;
        }
    });
    const buttons = [];
    Ux.itObject(ops, (key, value) => {
        const addButton = _renderOp(reference, key, value);
        if (addButton) buttons.push(addButton);
    });
    return (
        <Button.Group>
            {buttons.map((button = {}) => {
                const {text, ...rest} = button;
                return (<Button {...rest}>{text}</Button>)
            })}
        </Button.Group>
    )
};

const renderSearch = (reference) => {
    const options = Init.readOption(reference);
    const {term} = reference.state;
    const enabled = options['search.enabled'];
    const advanced = options['search.advanced'];
    return enabled ? (
        <Row>
            <Col span={18}>
                <Input.Search
                    placeholder={options['search.placeholder'] ?
                        options['search.placeholder'] : ""}
                    onSearch={Act.rxFilter(reference)}
                    value={term}
                    onChange={Act.rxInput(reference)}/>
            </Col>
            <Col span={5} offset={1}>
                <Button.Group>
                    <Button icon={"undo"}
                            onClick={Act.rxClear(reference)}/>
                    {advanced ? (<Button icon={"ellipsis"}
                                         onClick={() => {
                                             // 判断是否已经在快速搜索中输入了数据
                                             reference.setState({drawer: true})
                                         }}/>) : false}
                </Button.Group>
            </Col>
        </Row>
    ) : false
};

const renderDrawer = (reference) => {
    const options = Init.readOption(reference);
    const enabled = options['search.enabled'];
    const advanced = options['search.advanced'];
    if (enabled && advanced) {
        const {drawer = false} = reference.state;
        const config = {};
        config.placement = "right";
        config.maskClosable = false;
        config.visible = drawer;
        config.style = {
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53
        };
        config.width = options['search.advanced.width'];
        config.title = options['search.advanced.title'];
        const fnClose = () => {
            reference.setState({drawer: false})
        };
        config.maskClosable = true;
        config.onClose = fnClose;
        const {$formFilter: Component} = reference.props;
        const $inited = Ux.irKeepCond(reference);
        const fnTerm = (term = "") => {
            reference.setState({term})
        };
        const fnQueryDefault = () => Init.readQuery(reference);
        return Component ? (
            <Drawer {...config}>
                <Component
                    // 搜索表单默认值
                    $inited={$inited}
                    // 默认搜索条件，恢复输入框用
                    $cond={options['search.cond']}
                    // 宽度信息，用于Filter布局计算专用
                    $page={config.width}
                    // 关闭抽屉
                    fnClose={fnClose}
                    // 读取默认Query函数，传给查询表单
                    fnQueryDefault={fnQueryDefault}
                    // 清空快速搜索栏的搜索框
                    fnTerm={fnTerm} {...reference.props}/>
            </Drawer>
        ) : false
    } else return false;
};

const renderButton = (reference, item = {}, reset = false) => {
    return (event) => {
        // 动态连接专用
        event.preventDefault();
        const options = Init.readOption(reference);
        const {key, view} = reference.state;
        /**
         * 添加只有一个，所以如果包含了添加的情况不处理key相关信息（即添加不计算)
         */
        const prefix = reset ? options['submit.reset'] : options[`submit.${view}`];
        const connectId = "add" === view ? prefix : `${prefix}${key ? key : ""}`;
        // Monitor专用连接器
        Ux.D.writePointer(item, connectId);
        Ux.connectId(connectId);
    }
};

const _isLock = (reference, options = {}) => {
    /**
     * 是否触发条件删除流程
     * @type {boolean}
     */
    let isLock = false;
    if (options["op.delete.condition"]) {
        isLock = Boolean(options["op.delete.condition"]);
    }
    if (isLock) {
        // 读取初始值
        const {record, tabs = {}} = reference.state;
        const {activeKey} = tabs;
        const $inited = record[activeKey] ? record[activeKey] : {};
        isLock = $inited ? !!$inited.lock : false;
    }
    return isLock;
};

const renderSubmit = (reference) => {
    const options = Init.readOption(reference);
    const state = reference.state;
    const {view, key} = state;
    let opDeleted = true;
    if (options.hasOwnProperty(`op.${view}.delete`)) {
        opDeleted = options[`op.${view}.delete`];
        if (!opDeleted) {
            // 锁定就不删除的逻辑，这个地方应该是相反的属性逻辑
            opDeleted = !_isLock(reference, options)
        }
    }
    // 编辑按钮
    const editAttrs = {};
    editAttrs.icon = "save";
    if (options["op.connect.edit"]) {
        // 当前按钮被连接
        editAttrs.className = "ux-hidden";
        editAttrs.id = options["op.connect.edit"];
        editAttrs.key = options["op.connect.edit"];
    } else {
        // 设置连接点
        editAttrs.key = "_dynamic_Save"
    }
    editAttrs.onClick = renderButton(reference, editAttrs);
    // 重置按钮
    const resetAttrs = {};
    resetAttrs.icon = "reload";
    if (options["op.connect.reset"]) {
        // 当前按钮被连接
        resetAttrs.className = "ux-hidden";
        resetAttrs.id = options["op.connect.reset"];
        resetAttrs.key = options["op.connect.reset"];
    } else {
        // 设置连接点
        resetAttrs.key = "_dynamic_Reset"
    }
    resetAttrs.onClick = renderButton(reference, resetAttrs, true);
    return "list" !== view ? (
        <Button.Group>
            <Button {...editAttrs}/>
            {("edit" === view && opDeleted) ? (
                <Popconfirm
                    title={options['confirm.delete']}
                    onConfirm={() => Act.rxDeleteDetail(reference, key)}>
                    <Button icon={"delete"}
                            type={"danger"}/>
                </Popconfirm>
            ) : false}
            <Button {...resetAttrs}/>
        </Button.Group>
    ) : false
};
const renderMessage = (reference) => {
    let {$query} = reference.props;
    if ($query && $query.is()) {
        $query = $query.to();
        if ($query.criteria) {
            let condition = {};
            if ($query.criteria[""]) {
                // 取子条件
                Ux.itObject($query.criteria, (item, value) => {
                    if (U.isObject(value)) {
                        Object.assign(condition, value);
                    }
                })
            } else {
                // 取线性条件
                Object.assign(condition, $query.criteria);
            }
            const prefix = Ux.fromHoc(reference, "info").condition;
            const options = Init.readOption(reference);
            const config = options['search.cond.message'];
            if (config) {
                // 计算条件字符串
                let message = Ux.irMessage(prefix, condition, config);
                return message ? (
                    <Alert message={message}/>) : false
            }
        }
    }
    return false;
};
export default {
    renderOp,
    renderMessage,
    renderSearch,
    renderDrawer,
    renderSubmit
}