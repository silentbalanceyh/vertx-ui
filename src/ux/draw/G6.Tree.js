import Immutable from "immutable";
import G6 from "@antv/g6";
import G6Plugins from '@antv/g6/build/plugins'

const registry = () => {
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
};

const drawTree = (id, config) => {
    const items = Immutable.fromJS(config.items).toJS();
    registry();
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
    const attrs = {
        id,
        layout,
        animate: true,
        fitView: 'autoZoom',
        fitViewPadding: 20,
    };
    if (config.layout.height) {
        attrs.height = config.layout.height;
    }
    const tree = new G6.Tree(attrs);
    tree.node({
        shape: 'treeNode',
        size: 10
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
    });
    tree.draw();
};
const drawFlow = (id, config = {}) => {
    const items = Immutable.fromJS(config.items).toJS();
    registry();
    if (!config.layout) config.layout = {};
    G6.registerNode('rect', {
        getPath(item) {
            const width = (config.layout.width ? config.layout.width : 130);   // 一半宽
            const height = 32;  // 一半高
            return G6.Util.getRectPath(-width / 2, -height / 2, width, height, 10);
        },
    });
    const graph = new G6.Graph({
        container: id,
        fitView: 'autoZoom',
        fitViewPadding: 20,
        height: config.layout.height ? config.layout.height : window.innerHeight, // 画布高
        plugins: [new G6Plugins['layout.dagre']()],
        defaultIntersectBox: 'rect' // 使用矩形包围盒
    });

    graph.node({
        shape: 'rect',
        label(model) {
            return model.name;
        },
        style: {
            padding: 5
        }
    });
    graph.edge({
        style: {
            endArrow: true
        }
    });
    graph.read(items);
    graph.draw();
};
export default {
    drawTree,
    drawFlow
}