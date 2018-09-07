import React from 'react'
import './Cab.less'
import Ux from 'ux';
import {Table, Tag} from 'antd';

const analyzeItems = (source = {}) => {
    const nodes = [];
    source.nodes.filter(item => "string" === typeof item)
        .forEach(item => {
            const itemArr = item.split(',');
            const node = {};
            node.id = itemArr[0];
            node.name = itemArr[1];
            if (itemArr[2]) node.color = itemArr[2];
            if (itemArr[3]) node.width = Ux.valueInt(itemArr[3]);
            nodes.push(node);
        });
    const edges = [];
    source.edges.filter(item => "string" === typeof item)
        .forEach(item => {
            const fromTo = item.split(',');
            const node = {};
            node.source = fromTo[0];
            node.target = fromTo[1];
            edges.push(node);
        });
    return {nodes, edges}
};

const renderColumn = (columns = []) => {
    columns.forEach(column => {
        if ("name" === column.dataIndex) {
            column.render = (text, record) => {
                return (<Tag color={record.color} style={{
                    color: "black",
                    width: "100%",
                    textAlign: "center",
                    margin: 0,
                }}>{text}</Tag>)
            }
        }
    })
};

class Component extends React.PureComponent {
    componentDidMount() {
        // 挂载过后再绘制，保证g6Tree存在
        const {$source = {}} = this.props;
        $source.items = analyzeItems($source.items);
        Ux.G.drawFlow("g6WorkFlow", $source);
    }

    render() {
        const {$table = {}} = this.props;
        $table.data.forEach(item => item.key = Ux.randomUUID());
        const {data = [], ...rest} = $table;
        renderColumn(rest.columns);
        return Ux.aiGrid([3, 21],
            <Table className={"web-flow-table"}
                   {...rest} dataSource={data} pagination={false} bordered={true}/>,
            <div id={"g6WorkFlow"}/>
        )
    }
}

export default Component