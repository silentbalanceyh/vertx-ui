import React from 'react';
import Ux from "ux";
import {Button, Col, Row} from 'antd';

import Op from './Op';
import __Zn from "../zero.aero.dependency";
import Rdr from './Web';

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExEditorLink";

const componentInit = (reference) => {
    const state = {};
    const {
        config = {},
        $selected = []
    } = reference.props;
    const {
        tree = {},          // 左树
        search = {},        // 搜索
        ajax = {},          //
        table = {},
        tip = {}
    } = config;
    // Search
    state.$search = search;
    state.$tip = tip;
    state.$selected = $selected;

    Ux.parallel([
        Op.yiTree(tree, reference),
        Op.yiEditor(ajax, reference)
    ], "$tree", "query").then(response => {
        const {$tree = {}, query = {}} = response;
        state.$tree = $tree;
        Object.assign(state, query);

        const $table = Ux.fromHoc(reference, "table");
        $table.columns = Ux.configColumn(reference, table.columns);
        state.$table = $table;

        Ux.ajaxEager(reference, $table.columns, query.$data).then($lazy => {
            state.$lazy = $lazy;
            Ux.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        })
    })
}

const componentUp = (reference, virtual) => {
    const {$loading = false} = reference.state;
    if ($loading) {
        // 新条件（搜索框、左树、默认）
        const query = {
            "": true,
        };
        const {config = {}} = reference.props;
        {
            const {$keyword} = reference.state;
            const qrKeyword = {
                "": false
            }
            // 此处 condition 和 下边不一样
            const {condition = []} = config.search ? config.search : {};
            condition.forEach(cond => qrKeyword[cond] = $keyword ? $keyword : "__DELETE__");
            query["$keyword"] = qrKeyword;
        }
        {
            const {$keySet} = reference.state;
            // 此处 condition 和 上边不一样
            const {condition} = config.tree ? config.tree : {};
            if (condition && $keySet) {
                const keys = Array.from($keySet);
                if (0 < keys.length) {
                    query[condition] = keys;
                } else {
                    query[condition] = "__DELETE__";
                }
            }
        }
        const {ajax = {}} = config;
        const {$queryDefault = {}} = reference.state;
        const combine = Ux.qrCombine($queryDefault, reference, query);
        Op.rxSearch(ajax, combine).then(response => {
            const state = Ux.clone(response);
            Ux.of(reference).in(state).done();
            // reference.?etState(state);
            // state.$ready = true;
        })
    }
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {
            props: prevProps,
            state: prevState
        })
    }

    render() {
        return __Zn.yoRender(this, () => {
            const {config = {}} = this.props;
            const {tree = {}} = config;

            const attrEx = Sk.mixEx(UCA_NAME);
            return (
                <div {...attrEx}>
                    {Rdr.renderSearch(this)}
                    <Row>
                        <Col span={5}>
                            <div className={"ux_title"}>
                                {tree.title}
                            </div>
                            <div className={"tree"}>
                                {Rdr.renderTree(this)}
                            </div>
                        </Col>
                        <Col span={19}>
                            <div className={"content"}>
                                {Rdr.renderTable(this)}
                            </div>
                        </Col>
                    </Row>
                    <Button className={"ux_hidden"} id={config.button}
                            onClick={Op.rxSubmit(this)}/>
                </div>
            )
        }, __Zn.parserOfColor(UCA_NAME).private())
    }
}

export default Component