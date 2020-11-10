import G6 from '@antv/g6';
import Ux from 'ux';

/**
 * 自定义带箭头的贝塞尔曲线 edge
 */
G6.registerEdge("ppt-edge", {
    itemType: "edge",
    draw: function draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const centerPoint = {
            x: (startPoint.x + endPoint.x) / 2,
            y: (startPoint.y + endPoint.y) / 2
        };
        // 控制点坐标
        const controlPoint = {
            x: (startPoint.x + centerPoint.x) / 2,
            y: startPoint.y
        };

        // 为了更好的展示效果, 对称贝塞尔曲线需要连到箭头根部
        const path = group.addShape("path", {
            attrs: {
                path: [["M", startPoint.x, startPoint.y], ["Q", controlPoint.x + 8, controlPoint.y, centerPoint.x, centerPoint.y], ["T", endPoint.x - 8, endPoint.y], ["L", endPoint.x, endPoint.y]],
                stroke: "#ccc",
                lineWidth: 1.6,
                endArrow: {
                    path: "M 4,0 L -4,-4 L -4,4 Z",
                    d: 4
                }
            }
        });

        // 如果是不对称的贝塞尔曲线，需要计算贝塞尔曲线上的中心点
        // 参考资料 https://stackoverflow.com/questions/54216448/how-to-find-a-middle-point-of-a-beizer-curve
        // 具体Util方法可以参考G：https://github.com/antvis/g/blob/4.x/packages/g-math/src/quadratic.ts

        // 在贝塞尔曲线中心点上添加圆形
        const source = cfg.source,
            target = cfg.target;

        group.addShape("circle", {
            attrs: {
                id: "statusNode" + source + "-" + target,
                r: 6,
                x: centerPoint.x,
                y: centerPoint.y,
                fill: cfg.active ? "#AB83E4" : "#ccc"
            }
        });

        return path;
    }
});
const nodeExtraAttrs = {
    START: {
        fill: "#595959"
    },
    END: {
        fill: "#33af43"
    },
    UNIFORM: {
        fill: "#C2E999"
    }
};
G6.registerNode("ppt-node", {
    drawShape: function drawShape(cfg = {}, group) {
        // 开始节点和结束节点
        if ("START" === cfg.type || "END" === cfg.type) {
            return group.addShape("rect", {
                attrs: Object.assign({
                    x: -25,
                    y: -25,
                    width: 50,
                    height: 50,
                    radius: 25,
                    fill: "#9FD4FB",
                    fillOpacity: 1,
                    fontSize: 14,
                }, nodeExtraAttrs[cfg.type] ? nodeExtraAttrs[cfg.type] : {})
            });
        } else {
            const nodeAttrs = nodeExtraAttrs[cfg.type] ? nodeExtraAttrs[cfg.type] : {};
            if (cfg.active) {
                nodeAttrs.fill = "#3d8ce7";
            }
            return group.addShape("rect", {
                attrs: Object.assign({
                    x: -75,
                    y: -25,
                    width: 150,
                    height: 50,
                    radius: 4,
                    fill: "#9FD4FB",
                    fillOpacity: 1,
                    fontSize: 14,
                }, nodeAttrs)
            });
        }
    },
    setState: function setState(name, value, item) {
        const group = item.getContainer();
        const shape = group.get("children")[0]; // 顺序根据 draw 时确定

        if (name === "selected") {
            if (value) {
                shape.attr("fill", "#9FD4FB");
            } else {
                shape.attr("fill", "#9FD4FB");
            }
        }
    },
    getAnchorPoints: function getAnchorPoints() {
        return [[0, 0.5], [1, 0.5]];
    }
}, "single-shape")
export default (reference, step) => {
    const {$width = 800} = reference.props;
    const graph = new G6.Graph({
        container: "divPpt",
        width: $width,
        height: 200,
        fitView: "force",
        layout: {
            type: 'dagre',
            rankdir: 'LR'
        },
        defaultEdge: {
            shape: "ppt-edge",
            style: {
                endArrow: true,
                lineWidth: 2,
                stroke: "#ccc"
            }
        },
        defaultNode: {
            shape: "ppt-node",
            labelCfg: {
                style: {
                    fill: "#fff",
                    fontSize: 16
                }
            }
        }
    });
    const graphData = Ux.fromHoc(reference, "graphic");
    const {data = {}} = graphData;
    if (step) {
        data.nodes.forEach(item => {
            if (step === item.step) {
                item.active = true;
            }
        })
    }
    graph.data(data);
    graph.render();
}