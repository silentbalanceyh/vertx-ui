import G6 from "@antv/g6";
import Abs from '../abyss';
import Cmn from './I.common';

/**
 * id - div的HTML对应id
 * config - items：数据本身
 * config: 其他配置信息
 */
export default (id, config, view = "cc") => {
    const items = Abs.clone(config.items);
    Cmn.drawRegistry();
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
        fitView: view,
        fitViewPadding: 40,
    };
    if (config.layout.height) {
        attrs.height = config.layout.height;
    }
    const tree = new G6.Tree(attrs);
    tree.node({
        shape: 'treeNode',
        size: 10
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
    });
    tree.draw();
};