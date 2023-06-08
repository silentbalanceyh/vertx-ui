import React from 'react';
import {Col, Row} from 'antd';
import Ux from 'ux';
import __Zn from "../zero.aero.dependency";
import Rdr from './Web';

import Op from './Op';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExLinkage";

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
    // 初始化 linkage 专用
    const {$initial = {}} = reference.props;
    const initialValue = Ux.clone(initial);
    if (Ux.isNotEmpty($initial)) {
        Object.assign(initialValue, $initial);
    }
    Ux.dgDebug(initialValue, "初始化 Linkage 值集", "#14b4a7")
    state.$initial = initialValue;

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
            Ux.of(reference).in(state).done();
            // reference.?etState(state);
        })
    } else {

        Ux.of(reference).in(state).done();
        // reference.?etState(state);
    }
}

/*
 * 可重用的链接专用组件
 */
@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.yoRender(this, () => {
            const attrEx = Sk.mixEx(UCA_NAME);
            return (
                <div {...attrEx}>
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
        }, __Zn.parserOfColor(UCA_NAME).list({off: true}))
    }
}

export default Component