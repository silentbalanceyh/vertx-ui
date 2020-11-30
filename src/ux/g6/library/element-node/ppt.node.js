import G6 from '@antv/g6';

const nodeStroke = {
    START: "#FFAA15",
    END: "#72CC4A",
    UNIFORM: "#1A91FF"
};
const _getStroke = (cfg = {}) => nodeStroke[cfg['category'] ? cfg['category'] : 'UNIFORM'];
const _getWidth = (cfg = {}) => {
    const category = cfg['category'];
    if ("START" === category || "END" === category) {
        return 42;
    } else {
        return 88;
    }
}
const _getAddOn = (cfg = {}, stroke) => {
    const category = cfg['category'];
    if ("START" === category || "END" === category) {
        return {};
    } else {
        const item = {
            y: -15,
            height: 30,
            radius: 15,
        }
        if (cfg.active) {
            item.fill = stroke;
        }
        return item;
    }
}
export default (name) => G6.registerNode(name, {
    drawShape: (cfg = {}, group) => {
        const width = _getWidth(cfg);      // 固定宽度
        const stroke = _getStroke(cfg);
        const rect = group.addShape("rect", {
            attrs: {
                x: -width / 2,
                y: -20,
                width,
                height: 40,
                radius: 20,
                stroke,
                lineWidth: 1.2,
                fillOpacity: 1,
                ..._getAddOn(cfg, stroke),
            },
            name: 'ppt-shape-rect'
        });
        group.addShape('circle', {
            attrs: {
                x: width / 2,
                y: 0,
                r: 3,
                fill: stroke,
            },
            name: 'circle-shape2',
        });
        return rect;
    },
    getAnchorPoints: function getAnchorPoints() {
        return [
            [0, 0.5],
            [1, 0.5],
        ];
    },
    update: function update(cfg, item) {
        const group = item.getContainer();
        const children = group.get('children');
        const node = children[0];
        const circleLeft = children[1];
        const circleRight = children[2];

        const stroke = _getStroke(cfg);

        if (stroke) {
            node.attr('stroke', stroke);
            circleLeft.attr('fill', stroke);
            circleRight.attr('fill', stroke);
        }
    },
}, "single-shape")
