import Ux from "ux";
import {Table} from "antd";
import React from "react";
import G6 from "@antv/g6";

const COLOR = {
    "Array": "#696969",
    "Object": "#696969",
    "Set": "#696969",
    "Function": "#72CC4A",
    "Boolean": "#4169E1",
    "Number": "#00CDCD",
    "String": "#CDCD00"
}

class Graph extends React.Component {
    componentDidMount() {
        const {id, data = {}} = this.props;
        const graph = new G6.TreeGraph({
            container: id,
            fitViewPadding: 16,
            modes: {
                default: ['drag-canvas']
            },
            defaultNode: {
                type: 'rect',
                size: 30,
                labelCfg: {
                    style: {
                        fontSize: 14,
                    }
                },
            },
            layout: {
                type: 'dendrogram',
                direction: 'LR',
                nodeSep: 40,
                nodeSize: 20,
            }
        });
        graph.data(data);
        graph.render();
        graph.fitView();
    }

    render() {
        const {id, data = []} = this.props;
        let height = 0;
        Ux.itTree(data, () => height += 36);
        return (
            <div id={id} style={{
                width: "100%",
                minHeight: height
            }}/>
        )
    }
}

const parseTree = (input = {}, pName) => {
    const children = [];
    Object.keys(input).forEach(field => {
        const node = input[field];
        const item = {};
        item.id = pName + "-" + field;
        if (Ux.isArray(node.value)) {
            item.label = field + `[${node.value.length}]`;
        } else {
            item.label = field;
        }
        children.push(item);
    })
    return children;
}

export default {
    renderTable: (reference, data, spec = {}) => {
        const {key, comment = {}} = spec;
        let table = Ux.fromHoc(reference, key);
        table = Ux.clone(table);
        table.columns = Ux.configColumn(reference, table.columns);
        table.columns.forEach(column => {
            if ("value" === column.dataIndex) {
                column.render = (text, record = {}) => {
                    if (["Number", "Function", "Boolean", "String"].includes(record.type)) {
                        if ("Boolean" === record.type) {
                            return (
                                <span style={{color: "#1A91FF"}}>
                                    {text ? "true" : "false"}
                                </span>
                            )
                        } else {
                            return text;
                        }
                    } else {
                        return false;
                    }
                }
            } else if ("type" === column.dataIndex) {
                column.render = (text) => {
                    if (spec.type.includes(text)) {
                        return (
                            <span style={{color: "#1A91FF"}}>{text}</span>
                        )
                    } else if (text.startsWith("React")) {
                        return (
                            <span style={{color: "#FFAA15"}}>{text}</span>
                        )
                    } else {
                        const color = COLOR[text];
                        return (
                            <span style={{color}}>{text}</span>
                        )
                    }
                }
            } else if ("name" === column.dataIndex) {
                column.render = (name, record = {}) => {
                    if ("Function" === record.type) {
                        return (<span style={{color: "#9370DB"}}>{name}</span>)
                    } else {
                        if (comment[name]) {
                            return (
                                <span style={{color: "#F04864"}}>{name}</span>
                            )
                        } else {
                            return name;
                        }
                    }
                }
            }
        })
        // 数据
        return (
            <Table {...table} dataSource={data}/>
        )
    },
    renderGraph: (reference, data = {}) => {
        const {props, state} = data;
        const dataGraph = {
            id: data.name,
            label: data.name,
            children: [{
                id: "props",
                label: "props",
                children: parseTree(props, data.name + "-props")
            }, {
                id: "state",
                label: "state",
                children: parseTree(state, data.name + "-state")
            }]
        };
        return (
            <Graph data={dataGraph} id={data.name}/>
        );
    }
}