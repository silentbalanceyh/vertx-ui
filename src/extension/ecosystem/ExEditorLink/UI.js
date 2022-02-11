import React from 'react';
import Ux from "ux";
import {Col, Row} from 'antd';
import './Cab.less';
import Op from './Op';
import Ex from "ex";
import Rdr from './Web';

const componentInit = (reference) => {
    const state = {};
    const {config = {}} = reference.props;
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

    Ux.parallel([
        Op.yiTree(tree),
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

            state.$ready = true;
            reference.setState(state);
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
            reference.setState(state);
        })
    }
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExEditorLink")
    .to()
)
class Component extends React.PureComponent {
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
        return Ex.yoRender(this, () => {
            const {config = {}} = this.props;
            const {tree = {}} = config;
            return (
                <div className={"ex-editor-link"}>
                    {Rdr.renderSearch(this)}
                    <Row>
                        <Col span={5}>
                            <div className={"ux-title ux-title-pure"}>
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
                </div>
            )
        }, Ex.parserOfColor("ExEditorLink").private())
    }
}

export default Component