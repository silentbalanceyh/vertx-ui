import React from 'react';
import {component} from "../../../_internal";
import Ux from 'ux';
import {Col, Form, Row, Table} from 'antd';

import toColumn from './Web.Source.Fn.Column';
import source from './Web.Source.Fn.Source';

import LoadingContent from "../../../loading/LoadingContent/UI";

const yiInternal = (reference) => {
    const state = {};
    state.$ready = true;
    const {$inited = {}} = reference.props;
    /* 是否包含了初始化数据 */
    if (!Ux.isEmpty($inited)) {
        const normalized = [];
        Object.keys($inited).forEach(key => {
            const hitted = $inited[key];
            if (hitted && hitted.uri) {
                /* 读取 assert 数据 */
                const assist = {};
                assist.name = key;
                assist.key = key;
                /* 三种分离 */
                assist.method = hitted.method ? hitted.method : "GET";
                assist.uri = hitted.uri;
                normalized.push(assist);
            }
        })
        state.$data = normalized;
    } else {
        state.$data = [];
    }
    /* 已选中的表格配置 */
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = [toColumn(reference)].concat(Ux.configColumn(reference, $table.columns));
    state.$table = $table;
    Ux.raftForm(reference, {
        id: "SubForm-Layout",
        renders: {source}
    }).then(raft => {
        state.raft = raft;
        state.$op = {}
        return Ux.promise(state)
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Source",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$table = {}, $data = [], $inited = {}} = this.state;
            return (
                <div className={"viewer-database"}>
                    <Row>
                        <Col span={24}>
                            {(() => {
                                return (
                                    <div className={"database-form"}>
                                        {Ux.xtReady(this, () => Ux.aiForm(this, $inited),
                                            {component: LoadingContent}
                                        )}
                                    </div>
                                );
                            })()}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table {...$table} dataSource={$data}/>
                        </Col>
                    </Row>
                </div>
            )
        })
    }
}

export default Form.create({})(Component)