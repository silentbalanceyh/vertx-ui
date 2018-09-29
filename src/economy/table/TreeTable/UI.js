import React from 'react'
import './Cab.less'
import {Table} from 'antd'
import Op from './Op';
import {DataLabor} from 'entity';
import {_zero} from "../../_internal";
import LoadingContent from '../../loading/LoadingContent/UI';

@_zero({
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "grid": ["circle"]
            })
            .rinit(["circle"], true)
            .to()
    },
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        selected: undefined // 被选中的节点
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.initTable(this);
    }

    componentDidUpdate() {
        Op.updateData(this);
    }

    render() {
        const {$circle} = this.props;
        if ($circle.is()) {
            const {table = {columns: []}} = this.state;
            // 动态渲染
            const data = Op.initData(this, $circle.to());
            const processed = Op.calcTable(this, table);
            return (
                <Table {...processed} className={"web-table"}
                       dataSource={data}/>
            )
        } else return <LoadingContent/>
    }
}

export default Component