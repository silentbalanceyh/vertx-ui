import React from 'react'
import G6 from '@antv/g6';
import Immutable from 'immutable';
import {v4} from 'uuid';
import {Col, Collapse, Icon, Row, Table} from 'antd';
import {_zero} from "../../_internal";

const renderColumn = (columns = [], mapping = {}) => {
    columns.forEach(column => {
        if ("source" === column.dataIndex) {
            column.render = (text) => {
                const item = mapping['source'][text];
                return (
                    <span><Icon {...item}/></span>
                )
            }
        }
        if ("type" === column.dataIndex) {
            column.render = (text) => (<span style={{
                color: "#bc0981"
            }}>{text}</span>)
        }
        if ("required" === column.dataIndex) {
            column.render = (text) => {
                const type = text ? "check" : "close";
                return <Icon type={type}/>;
            }
        }
        if ("name" === column.dataIndex || "option" === column.dataIndex) {
            column.render = (text) => {
                if ("reference" === text || "children" === text) {
                    return (
                        <span style={{
                            color: "#9551f6"
                        }}>{text}</span>
                    )
                } else {
                    return "name" === column.dataIndex ? (
                        <span style={{
                            color: "#1e358c"
                        }}>{text}</span>
                    ) : (
                        <span style={{
                            color: "#4169E1"
                        }}>{text}</span>
                    )
                }
            }
        }
        if ("value" === column.dataIndex) {
            column.render = (text, record) => {
                if ("String" === record.type) {
                    text = `"${text}"`;
                    return (<span style={{
                        color: "#87d068"
                    }}>{text}</span>)
                } else {
                    return text;
                }
            }
        }
    })
};

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI"
})
class Component extends React.PureComponent {
    componentDidMount() {
        const {id = "g6Tree", reference} = this.props;
        const {$hoc} = reference.state;
        const config = $hoc._("configuration");
        if (id && config) {
            const items = Immutable.fromJS(config.items).toJS();
            G6.registerNode('treeNode', {
                anchor: [[0, 0.5], [1, 0.5]],
                enterAnimate: function enterAnimate(item) {
                    const group = item.getGraphicGroup();
                    const model = item.getModel();
                    const x = model.x;
                    const y = model.y;
                    group.transform([['t', -x, -y], ['s', 0.01, 0.01], ['t', x, y]]);
                    !group.get('destroyed') && group.animate({
                        transform: [['t', -x, -y], ['s', 100, 100], ['t', x, y]]
                    }, 450, 'easeBackOut');
                },
            });
            G6.registerEdge('smooth', {
                getPath: function getPath(item) {
                    const points = item.getPoints();
                    const start = points[0];
                    const end = points[points.length - 1];
                    const hgap = Math.abs(end.x - start.x);
                    if (end.x > start.x) {
                        return [['M', start.x, start.y], ['C', start.x + hgap / 4, start.y, end.x - hgap / 2, end.y, end.x, end.y]];
                    }
                    return [['M', start.x, start.y], ['C', start.x - hgap / 4, start.y, end.x + hgap / 2, end.y, end.x, end.y]];
                }
            });
            const layout = new G6.Layouts.CompactBoxTree({
                // direction: 'LR', // 方向（LR/RL/H/TB/BT/V）
                getHGap: function getHGap() /* d */ {
                    // 横向间距
                    return config.layout.hgap;
                },
                getVGap: function getVGap() /* d */ {
                    // 竖向间距
                    return config.layout.vgap;
                },
            });
            const tree = new G6.Tree({
                id,
                height: config.layout.height, // 画布高
                layout: layout,
                animate: true,
                fitView: 'cc' // 自动缩放
            });
            tree.node({
                shape: 'treeNode',
                size: 16
            }).label(function (obj) {
                return obj.name;
            });
            tree.edge({
                shape: 'smooth'
            });
            tree.on('afterchange', function () {
                tree.getNodes().forEach(function (node) {
                    const label = node.getLabel();
                    const keyShape = node.getKeyShape();
                    const children = node.getChildren();
                    const box = keyShape.getBBox();
                    const labelBox = label.getBBox();
                    let dx = (box.maxX - box.minX + labelBox.maxX - labelBox.minX) / 2 + 8;
                    let dy = 0;
                    if (children.length !== 0) {
                        dx = -dx;
                    }
                    label.translate(dx, dy);
                });
                tree.draw();
            });
            tree.read({
                roots: [items]
            })
        }
    }

    render() {
        const {id = "g6Tree", $name} = this.props;
        const {reference} = this.props;
        const current = this.state.$hoc;
        const icon = current._("comment").icon;
        const type = current._("comment").type;
        const table = current._("table");
        const data = reference.state.$hoc._("data");
        data.forEach(item => item.key = v4());
        renderColumn(table.columns, current._("mapping"));
        return (
            <div>
                <Row style={{
                    backgroundColor: "#f2f4f5",
                    padding: 10,
                    marginBottom: 10,
                    fontSize: 14
                }}>
                    <Col span={23} offset={1}>
                        <span style={{
                            color: "#e43a32"
                        }}>import</span>
                        &nbsp;&nbsp;
                        <span style={{
                            color: "#3a8df7"
                        }}>{`{ ${$name} }`}</span>
                        &nbsp;&nbsp;
                        <span style={{
                            color: "#e43a32"
                        }}>from</span>
                        &nbsp;&nbsp;
                        <span style={{
                            color: "#418345"
                        }}>'web';</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={3}>
                        <Collapse activeKey={[icon.key, type.key]}>
                            <Collapse.Panel header={icon.title} key={icon.key}>
                                {icon.items.map(item => (
                                    <div key={item.color} style={{
                                        marginBottom: 10
                                    }}>
                                        <Icon type={"info-circle"} style={{
                                            fontSize: 16,
                                            color: item.color
                                        }}/>&nbsp;&nbsp;{item.text}
                                    </div>
                                ))}
                            </Collapse.Panel>
                            <Collapse.Panel header={type.title} key={type.key}>
                                {type.items.map(item => (
                                    <div key={item.color} style={{
                                        marginBottom: 10
                                    }}>
                                        <Icon type={item.icon} style={{
                                            fontSize: 16,
                                            color: item.color
                                        }}/>&nbsp;&nbsp;{item.text}
                                    </div>
                                ))}
                            </Collapse.Panel>
                        </Collapse>
                    </Col>
                    <Col span={21}>
                        <div id={id}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table pagination={false} {...table} dataSource={data}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component