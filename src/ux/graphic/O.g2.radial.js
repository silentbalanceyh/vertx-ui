import Cmn from './I.common';

export default (
    id, config = {}, data = []
) => Cmn.drawGraphic(id, config, data, (graphic, metadata = {}) => {
    const {
        coord = {},
        point = {},
        legend = {},
        draw,
        transform = {}
    } = metadata;
    // 半径
    graphic.coord("polar", coord);
    graphic.axis(point.x, {
        line: null,
        tickLine: null,
        grid: {
            lineStyle: {
                lineDash: null
            },
            hideFirstLine: false
        }
    });
    graphic.axis(transform.value ? transform.value : point.y, {
        line: null,
        tickLine: null,
        grid: {
            type: 'polygon',
            lineStyle: {
                lineDash: null
            },
            alternateColor: 'rgba(0, 0, 0, 0.04)'
        }
    });
    graphic.legend(transform.key ? transform.key : point.x, legend);
    graphic.line().position(draw.position)
        .color(draw.color)
        .size(2);
    graphic.point().position(draw.position)
        .color(draw.color)
        .shape("circle")
        .size(4)
        .style({
            stroke: '#fff',
            lineWidth: 1,
            fillOpacity: 1
        });
    graphic.area().position(draw.position)
        .color(draw.color);
}, {
    fnPre: (metadata) => {
        if (15 < data.length) {
            metadata.chart.height = data.length * 20;
        }
    }
});