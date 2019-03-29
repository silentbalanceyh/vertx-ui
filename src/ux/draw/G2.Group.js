import Util from "./G2.Util";

const drawBar = (id, config = {}, data = []) =>
    Util.drawGraphic(id, config, data, (graphic, metadata = {}) => {
        const {point, scale, draw, adjust = {}} = metadata;
        graphic.scale(point.x, scale);
        graphic.interval()
            .position(draw.position)
            .color(draw.color)
            .adjust([adjust]);
    });
export default {
    drawBar,
};