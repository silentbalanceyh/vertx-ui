import React from 'react';
import {Col, Row} from 'antd';
import Ux from 'ux';
import Ex from 'ex';
import Rdr from './Web';
import './Cab.less';
import Op from './Op';

const componentInit = (reference) => {
    const {config = {}, value = []} = reference.props;
    const {
        message = {},
        table = {},
        editor = {}
    } = config;
    // 新的数据结构处理
    const {
        initial = {},
        search = {},
    } = editor;
    // Action
    const action = Ux.fromHoc(reference, "action");
    let {add = {}, remove = {}, save = {}} = action;
    add = Ux.clone(add);
    remove = Ux.clone(remove);
    add.text = message.add;

    const state = {};
    state.$action = {add, remove, save};

    // Window
    let window = Ux.fromHoc(reference, "window");
    window = Ux.configDialog(reference, window);
    window.title = message.window;
    state.$window = window;

    // Editor - Search
    const $editor = Ux.clone(editor);
    const $search = {};
    Object.assign($search, search);
    $search.label = message.search;
    $editor.search = $search;
    // Editor - Tree
    $editor.table = table;
    $editor.button = window.__onOk;
    $editor.validation = message.failure;
    // Editor - Tip
    $editor.tip = {}
    $editor.tip.message = message.tip;

    state.$editor = $editor;
    table.columns = Ux.configColumn(reference, table.columns);
    state.$table = table;

    state.$initial = initial; // 初始化 linkage 专用

    state.$ready = true;
    // 更新当前属性的默认值
    const $data = [];
    value.forEach(row => $data.push(Op.valueRow(row)));
    state.$data = $data;
    state.$save = {
        data: Ux.clone($data),
        message: message.success
    }
    if (0 < $data.length) {
        Ux.ajaxEager(reference, table.columns, $data).then($lazy => {
            state.$lazy = $lazy;
            reference.setState(state);
        })
    } else {
        reference.setState(state);
    }
}

/*
 * 可重用的链接专用组件
 */
@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExLinkage")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            return (
                <div className={"ex-linkage"}>
                    <Row>
                        <Col span={12}>
                            {Rdr.renderLink(this)}
                            &nbsp;
                            {Rdr.renderUnlink(this)}
                            &nbsp;
                            {Rdr.renderSave(this)}
                        </Col>
                        <Col span={12} className={"tip"}>
                            {Rdr.renderWindow(this)}
                            {Rdr.renderTip(this)}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={"content"}>
                            {Rdr.renderTable(this)}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("ExLinkage").list({off: true}))
    }
}

// Fix issue of Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
// 如果需要外包装成表单级getFieldDecorator，就必须多加一层
// 主要是存在 @zero 注解的表单必须如此操作
class Wrap extends React.PureComponent {
    render() {
        return (
            <Component {...this.props}/>
        )
    }
}

export default Wrap