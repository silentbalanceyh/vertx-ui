import Cmn from './I.common';
import Dev from "../../develop";

export default (
    id, config = {}, data = []
) => Cmn.drawGraphic(id, config, data, (graphic, metadata = {}) => {
    const {
        tooltip = {},
        draw,
        label,
    } = metadata;
    Dev.dgDebug(metadata, "[ UxG ] Pie饼图绘制", "#CD9B1D");
    // 处理 coord
    graphic.coord('theta');
    graphic.tooltip(tooltip);
    graphic.intervalStack()
        .position(draw.position)
        .color(draw.color)
        .label(label.field, {
            offset: label.offset,
            textStyle: {
                textAlign: 'center',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)'
            }
        })
        .tooltip(tooltip.value, (item, percent) => ({
            name: item,
            value: Cmn.FUN['PERCENT'](percent)
        }))
        .style({
            lineWidth: 1,
            stroke: "#fff"
        });

});