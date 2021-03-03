import React from 'react';
import G6 from "@antv/g6";
// 自定义节点
const style = {
    data: {
        stroke: "#ff5758",
        fill: "#fef6f6",
    },
    relation: {
        stroke: "#19a8ff",
        fill: "#f2fbff"
    },
    action: {
        stroke: "#47d3cc",
        fill: "#edfffe"
    }
}
G6.registerNode('single-model', {
        drawShape: function drawShape(cfg, group) {
            const width = cfg.style.width;
            // 类型下的两个特殊属性
            // stroke：线的颜色
            // fill：填充的颜色
            const {data = {}} = cfg;
            const type = data.type;
            const attrOn = style[type] ? style[type] : {}
            // 构造 label
            return group.addShape('rect', {
                attrs: {
                    x: -width / 2,
                    y: -15,
                    width,
                    height: 30,
                    lineWidth: 1,
                    fillOpacity: 1,
                    textSize: 13,
                    ...attrOn,
                }
            });
        },
        getAnchorPoints: function getAnchorPoints() {
            return [[0, 0.5], [1, 0.5]];
        },
        update: function (cfg, item) {
            const group = item.getContainer()
            const children = group.get('children')
            const node = children[0]
            const circleLeft = children[1]
            const circleRight = children[2]

            const {style: {stroke}} = cfg
            if (stroke) {
                node.attr('stroke', stroke)
                circleLeft.attr('fill', stroke)
                circleRight.attr('fill', stroke)
            }
        }
    },
    'single-shape'
);

class Component extends React.PureComponent {
    componentDidMount() {
        const {data, $height = 400} = this.props;
        const graph = new G6.TreeGraph({
            container: "ops-model-graph",
            fixedRoot: true,
            width: 900,
            height: $height,
            modes: {
                default: ['drag-canvas']
            },
            defaultNode: {
                type: 'single-model',
                labelCfg: {
                    style: {
                        fill: '#6b6b6b',
                        fontSize: 12,
                    }
                },
                style: {
                    stroke: '#72CC4A',
                    width: 120,
                }
            },
            defaultEdge: {
                style: {
                    stroke: '#9b9b9b'
                }
            },
            layout: {
                type: 'dendrogram',
                direction: 'LR',
                nodeSep: 40,
                nodeSize: 20,
                rankSep: 210,
                center: [450, 200],
            }
        })
        graph.data(data);
        graph.render();
        // 居中的位置处理
        graph.fitView();
    }

    render() {
        return (
            <div id={"ops-model-graph"} className={"graph-view"}/>
        )
    }
}

export default Component