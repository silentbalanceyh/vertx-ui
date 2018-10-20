import React from 'react';
import './Cab.less';
import {Table} from 'antd';
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
            .rinit(["circle"])
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
        Op.initComponent(this);
    }

    componentDidUpdate() {
        Op.updateData(this);
    }

    render() {
        const {current} = this.state;
        if (current) {
            const {table = {columns: []}} = this.state;
            // 动态渲染
            const processed = Op.calcTable(this, table);
            return (
                <Table {...processed} className={"web-table"}
                       dataSource={current}/>
            );
        } else return (<LoadingContent/>);
    }
}

export default Component;