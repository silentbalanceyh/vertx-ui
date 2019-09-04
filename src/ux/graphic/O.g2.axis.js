import Cmn from './I.common';

export default (
    id, config = {}, data = []
) => Cmn.drawGraphic(id, config, data, (graphic, metadata = {}) => {
    const {point, axis, draw} = metadata;
    graphic.coord().transpose();
    graphic.axis(point.y, axis);
    graphic.interval()
        .position(draw.position)
        .color(draw.color);
}, {
    fnPre: (metadata) => {
        if (15 < data.length) {
            metadata.chart.height = data.length * 32;
        }
    }
});