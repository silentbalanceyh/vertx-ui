import G2 from '@antv/g2';
import Value from '../Ux.Value';
import Dg from '../Ux.Debug';
import DataSet from "@antv/data-set";
import U from 'underscore';
// 关闭 G2 的体验改进计划
G2.track(false);
const _getChart = (id, config = {}, data = []) => {
    // Tree处理
    const metadata = Value.valueLadder(config);
    // 构造G2的图
    const {
        point = {},     // x轴，y轴
        chart = {},     //
        draw = {},      // 绘制过程中的配置
        scale,          // Bar需要
        axis,            // Axis需要
        coord,          // 雷达图需要
        legend,         // 雷达图需要
        transform,      // 数据转换专用
        adjust,         // 分组时用
    } = metadata;
    // 处理container
    chart.container = id;   // 特殊处理
    // 数据源处理
    const ds = new DataSet();
    const source = ds.createView().source(data);
    if (transform) {
        source.transform(transform);
    }
    // 处理marginRadio
    if (adjust && U.isObject(adjust['marginRadio'])) {
        const {up = 1, down = 32} = adjust['marginRadio'];
        adjust['marginRadio'] = up / down;
    }
    // 加载数据源
    return {
        point,
        chart,
        scale,
        draw,
        source,
        axis,
        coord,
        legend,
        transform,
        adjust
    };
};

const _drawGraphic = (id, config = {}, data = [], fnDraw, fnPre) => {
    let metadata = _getChart(id, config, data);
    if (U.isFunction(fnPre)) {
        // 副作用函数，不使用返回值，直接修改metadata
        fnPre(metadata);
    }
    Dg.dgDebug(metadata, "绘图配置数据：");
    const {
        chart = {},
        source,
    } = metadata;
    if (metadata.source) {
        const graphic = new G2.Chart({
            ...chart
        });
        graphic.source(source);
        if (U.isFunction(fnDraw)) {
            fnDraw(graphic, metadata);
        }
        graphic.render();
    } else {
        console.error("数据初始化失败！", source);
    }
};

const drawBar = (id, config = {}, data = []) =>
    _drawGraphic(id, config, data, (graphic, metadata = {}) => {
        const {point, scale, draw} = metadata;
        graphic.scale(point.x, scale);
        graphic.interval()
            .position(draw.position)
            .color(draw.color);
    });
const drawAxis = (id, config = {}, data = []) =>
    _drawGraphic(id, config, data, (graphic, metadata = {}) => {
        const {point, axis, draw} = metadata;
        graphic.coord().transpose();
        graphic.axis(point.y, axis);
        graphic.interval()
            .position(draw.position)
            .color(draw.color);
    }, (metadata) => {
        if (15 < data.length) {
            metadata.chart.height = data.length * 32;
        }
    });

const drawRadial = (id, config = {}, data = []) =>
    _drawGraphic(id, config, data, (graphic, metadata = {}) => {
        const {
            coord = {}, point = {}, legend = {}, draw,
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
    }, (metadata) => {
        if (15 < data.length) {
            metadata.chart.height = data.length * 20;
        }
    });
const drawGroupBar = (id, config = {}, data = []) =>
    _drawGraphic(id, config, data, (graphic, metadata = {}) => {
        const {point, scale, draw, adjust = {}} = metadata;
        graphic.scale(point.x, scale);
        graphic.interval()
            .position(draw.position)
            .color(draw.color)
            .adjust([adjust]);
    });
export default {
    drawBar,
    drawGroupBar,
    drawAxis,
    drawRadial
};