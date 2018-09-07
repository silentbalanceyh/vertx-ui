import React from 'react'
import './Cab.less'
import Ux from 'ux';
import {Table, Tag} from 'antd';
import Immutable from 'immutable';

const analyzeItems = (source = {}, current = []) => {
    const nodes = [];
    const $current = Immutable.fromJS(current);
    source.nodes.filter(item => "string" === typeof item)
        .forEach(item => {
            const itemArr = item.split(',');
            const node = {};
            node.id = itemArr[0];
            node.name = itemArr[1] ? itemArr[1] : node.id;
            if (itemArr[2]) {
                node.color = itemArr[2];
            } else {
                node.color = "#cdcdcd";
            }
            // 对比处理
            if ($current.contains(node.name)) {
                node.color = "#f66";
            }
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
    {
        edges.forEach(item => {
            let found = nodes.filter(each => each.id === item.source);
            if (0 === found.length) {
                console.info(item.source);
            }
            found = nodes.filter(each => each.id === item.target);
            if (0 === found.length) {
                console.info(item.target);
            }
        })
    }
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
        const {$source = {}, $current = []} = this.props;
        $source.items = analyzeItems($source.items, $current);
        Ux.G.drawFlow("g6WorkFlow", $source);
    }

    render() {
        const {$table = {}} = this.props;
        $table.data.forEach(item => item.key = Ux.randomUUID());
        const {data = [], ...rest} = $table;
        renderColumn(rest.columns);
        const attrs = {
            pagination: false,
            bordered: true
        };
        return Ux.aiGrid([2, 22],
            <Table className={"web-flow-table"}
                   {...rest} dataSource={data} {...attrs}/>,
            <div id={"g6WorkFlow"}/>
        )
    }
}

export default Component