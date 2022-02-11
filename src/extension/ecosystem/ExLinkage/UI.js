import React from 'react';
import {Col, Row} from 'antd';
import Ux from 'ux';
import Ex from 'ex';
import Rdr from './Web';

const componentInit = (reference) => {
    const {config = {}} = reference.props;
    const {
        message = {},
        tree = {},
        search = {},
        ajax = {},
        table = {}
    } = config;

    // Action
    const action = Ux.fromHoc(reference, "action");
    let {add = {}, remove = {}} = action;
    add = Ux.clone(add);
    remove = Ux.clone(remove);
    add.text = message.add;

    const state = {};
    state.$action = {add, remove};

    // Window
    let window = Ux.fromHoc(reference, "window");
    window = Ux.configDialog(reference, window);
    window.title = message.window;
    state.$window = window;

    // Editor - Search
    const editor = {};
    const $search = {};
    Object.assign($search, search);
    $search.label = message.search;
    editor.search = $search;
    // Editor - Tree
    editor.tree = Ux.clone(tree);
    editor.ajax = ajax;
    editor.table = table;
    // Editor - Tip
    editor.tip = {}
    editor.tip.message = message.tip;

    state.$editor = editor;
    state.$table = table;

    state.$ready = true;
    reference.setState(state);
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
                <div>
                    <Row>
                        <Col span={6}>
                            {Rdr.renderLink(this)}
                            &nbsp;
                            {Rdr.renderUnlink(this)}
                        </Col>
                        <Col span={18}>
                            {Rdr.renderWindow(this)}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>

                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("ExLinkage").list())
    }
}

export default Component