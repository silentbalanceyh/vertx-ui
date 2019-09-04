import DataSet from "@antv/data-set";
import U from "underscore";
import Dev from "../develop";
import G2 from "@antv/g2";
import Abs from '../abyss';
import Ele from '../element';
import G6 from "@antv/g6";

const FUN = {
    "PERCENT": (value) => value * 100 + "%"
};

const initOptions = (options) => {
    options = Abs.clone(options);
    const {percent = {}} = options;
    if ("PERCENT" === percent.formatter) {
        percent.formatter = FUN[percent.formatter];
    }
    return options;
};
// G2.track(false);
const initGrahpic = (id, config = {}, data = []) => {
    // Tree处理
    const metadata = Ele.valueLadder(config);
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
        options = {},   // options替换 source API中的options
        tooltip = {},   // tooltip处理
        label = {},     // 饼状图
    } = metadata;
    // 处理container
    chart.container = id;   // 特殊处理
    // 数据源处理
    const ds = new DataSet();
    // 针对选项的预处理
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
    const exported = {
        point,
        chart,
        scale,
        draw,
        source,
        axis,
        coord,
        legend,
        transform,
        adjust,
        tooltip,
        options,
        label,
    };
    for (const key in exported) {
        if (!exported[key]) {
            delete exported[key];
        }
    }
    return exported;
};
const drawGraphic = (id, config = {}, data = [], fnDraw = () => false, callback = {}) => {
    const {
        fnPre = () => false,    // 元数据 metadata 的修改（绘图之前）
    } = callback;
    let metadata = initGrahpic(id, config, data);
    if (U.isFunction(fnPre)) {
        // 副作用函数，不使用返回值，直接修改metadata
        fnPre(metadata);
    }
    Dev.dgDebug(metadata, "[ UxG ] 绘图配置数据：", "#CD9B1D");
    const {
        chart = {},
        source,
        options = {},
    } = metadata;
    if (metadata.source) {
        const graphic = new G2.Chart({
            ...chart
        });
        graphic.source(source, initOptions(options));
        if (U.isFunction(fnDraw)) {
            fnDraw(graphic, metadata);
        }
        graphic.render();
    } else {
        console.error("数据初始化失败！", source);
    }
};
const drawRegistry = () => {
    G6.registerNode('treeNode', {
        anchor: [[0, 0.5], [1, 0.5]],
        /**
         enterAnimate: function enterAnimate(item) {
            const group = item.getGraphicGroup();
            const model = item.getModel();
            const x = model.x;
            const y = model.y;
            group.transform([['t', -x, -y], ['s', 0.01, 0.01], ['t', x, y]]);
            !group.get('destroyed') && group.animate({
                transform: [['t', -x, -y], ['s', 100, 100], ['t', x, y]]
            }, 450, 'easeBackOut');
        },**/
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
export default {
    drawGraphic,
    drawRegistry,
    FUN
};