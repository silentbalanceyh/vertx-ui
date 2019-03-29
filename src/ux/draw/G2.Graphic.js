// 关闭 G2 的体验改进计划
import Util from './G2.Util';
import Group from './G2.Group';
import Debug from '../Ux.Debug';

/**
 * point.x
 * scale系列
 * draw.position
 * draw.colo
 */
const drawBar = (id, config = {}, data = []) =>
    Util.drawGraphic(id, config, data, (graphic, metadata = {}) => {
        const {point, scale, draw} = metadata;
        graphic.scale(point.x, scale);
        graphic.interval()
            .position(draw.position)
            .color(draw.color);
    });
/**
 * point.y
 * axis系列
 * draw.position
 * draw.color
 */
const drawAxis = (id, config = {}, data = []) =>
    Util.drawGraphic(id, config, data, (graphic, metadata = {}) => {
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
const drawPie = (id, config = {}, data = []) =>
    Util.drawGraphic(id, config, data, (graphic, metadata = {}) => {
        const {
            tooltip = {},
            draw,
            label,
        } = metadata;
        Debug.dgDebug(metadata, "Pie饼图绘制");
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
                value: Util.getFun['PERCENT'](percent)
            }))
            .style({
                lineWidth: 1,
                stroke: "#fff"
            });

    });
const drawRadial = (id, config = {}, data = []) =>
    Util.drawGraphic(id, config, data, (graphic, metadata = {}) => {
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
export default {
    drawBar,        // 条形图
    drawAxis,       // 柱状图
    drawRadial,     // 雷达图
    drawPie,        // 饼图
    // 多个组的情况
    drawGroupBar: Group.drawBar,   // 分组条形图
};