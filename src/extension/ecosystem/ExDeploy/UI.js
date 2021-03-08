import React from 'react';
import {LoadingAlert} from "web";
import Ux from 'ux';
import {Col, Icon, Row, Statistic} from 'antd';
import './Cab.less';
import G6 from "@antv/g6";

Ux.g6Registry([
    'edge-ppt',
    'node-ppt'
])
/**
 * ## 「组件」`ExDeploy`
 *
 * ```js
 * import { ExDeploy } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 *
 * #### 1.1. 布局
 *
 * ```shell
 * |-------------------------------------------------------------------------------------|
 * |                  Node  ----> Node                                                   |
 * |                  /             \                                                    |
 * |                 /               \                                                   |
 * |   Start ----> Node              Node ----> Node ----> Node ----> Node ----> End     |
 * |                 \               /            \                           /          |
 * |                  \             /              \                         /           |
 * |                  Node  ----> Node             Node ----> Node ----> Node            |
 * |-------------------------------------------------------------------------------------|
 * ```
 *
 * @memberOf module:web-component
 * @method ExDeploy
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const {$width = 800, step} = reference.props;
    const graph = new G6.Graph({
        container: "divPpt",
        width: $width,
        height: 200,
        layout: {
            type: 'dagre',
            rankdir: 'LR',
            ranksep: 30,
            nodesep: 30,
            workerEnabled: true
        },
        fitView: 'force',
        defaultNode: {
            type: 'node-ppt',
            labelCfg: {
                style: {
                    fill: '#000000A6',
                    fontSize: 12,
                },
            },
            style: {
                stroke: '#72CC4A',
                width: 150,
            },
        },
        defaultEdge: {
            type: 'edge-ppt'
        }
    });
    const graphData = Ux.fromHoc(reference, "graphic");
    const {data = {}} = graphData;
    if (step) {
        data.nodes.forEach(item => {
            if (step === item.step) {
                item.active = true;
                item.labelCfg = {
                    style: {
                        fill: 'white'
                    }
                }
            }
        })
    }
    graph.data(data);
    graph.render();
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExDeploy")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        const {alert, step = 1} = this.props;
        return (
            <div>
                {(() => {
                    const header = Ux.fromHoc(this, "header");
                    const content = header.title[step];
                    if (content) {
                        const {value, icon} = content;
                        return (
                            <Row className={"ex-ppt"}>
                                <Col span={24}>
                                    <Statistic title={header.prefix} value={value}
                                               prefix={<Icon type={icon}/>}/>
                                </Col>
                            </Row>
                        )
                    } else return false;
                })()}
                {alert ? (<LoadingAlert $alert={alert}/>) : false}
                <div id={"divPpt"}/>
            </div>
        )
    }
}

export default Component