import G6 from "@antv/g6";

export default (name) => G6.registerEdge(name, {
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

        return group.addShape("path", {
            attrs: {
                path: [["M", startPoint.x, startPoint.y], ["Q", controlPoint.x + 8, controlPoint.y, centerPoint.x, centerPoint.y], ["T", endPoint.x - 8, endPoint.y], ["L", endPoint.x, endPoint.y]],
                stroke: "#ccc",
                lineWidth: 0.9,
                endArrow: true
            }
        });
    }
});