import React from 'react';
import {component} from "../../../_internal";
import Ux from 'ux';
import {Table} from 'antd';

const yiColumn = (reference) => {

}

const yiInternal = (reference) => {
    const state = {};
    state.$ready = true;
    const {$inited = {}} = reference.props;
    /* 是否包含了初始化数据 */
    if (!Ux.isEmpty($inited)) {
        const normalized = [];
        Object.keys($inited).forEach(key => {
            /* 读取 assert 数据 */
        })
    } else {
        state.$data = [];
    }
    /* 已选中的表格配置 */
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, $table.columns);
    state.$table = $table;
    state.$ready = true;
    reference.setState(state);
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
            const {$table = {}} = this.state;
            return (
                <div className={"viewer-database"}>
                    <Table {...$table}/>

                </div>
            )
        })
    }
}

export default Component