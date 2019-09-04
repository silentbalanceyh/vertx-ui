import Cmn from "./I.common"

export default (
    id, config = {}, data = []
) => Cmn.drawGraphic(id, config, data, (graphic, metadata = {}) => {
    const {point, scale, draw} = metadata;
    graphic.scale(point.x, scale);
    graphic.interval()
        .position(draw.position)
        .color(draw.color);
});