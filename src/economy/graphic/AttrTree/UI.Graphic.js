import G6 from "@antv/g6";
import Ux from "ux";

const drawGraphic = (id, config) => {
    const items = Ux.clone(config.items);
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
        return obj && obj.name ? obj.name : "";
    });
    tree.edge({
        shape: 'smooth'
    });
    tree.on('afterchange', function () {
        tree.getNodes().forEach(function (node) {
            if (node) {
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
            }
        });
        tree.draw();
    });
    tree.read({
        roots: [items]
    })
};
export default {
    drawGraphic
}