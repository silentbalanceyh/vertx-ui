import __Zn from './zero.module.dependency';
import {Chart} from "@antv/g2";

const g2Chart = (id, config = {}) => {
    const {
        chart = {},             // 图配置
        tooltip = {},           // Tooltip配置
        interval = {},          // Interval配置
        dim = {},               // 维度配置
        legend,          // 图例
    } = config;
    __Zn.dgDebug(config, "图配置相关信息");
    // 创建 g2 图信息
    const graphic = new Chart({
        container: id,
        autoFit: true,
        ...chart
    });
    if (undefined !== legend) {
        graphic.legend(legend);
    }
    // 处理 Tooltip
    graphic.tooltip({
        showMarkers: true,
        showTitle: true,
        ...tooltip
    });

    // Interval专用
    const {
        adjust = {
            type: "stack",
            marginRatio: 1 / 32
        },               // .adjust
        color = [],                     // .color
        // 特殊字段
        position = "value",             // .position
        label = {}
    } = interval;
    const {
        field = "name",
    } = dim;
    if (0 < color.length) {
        graphic.interval().position(position).adjust(adjust)
            .color(field, color).label(field, () => ({
            ...label
        }));
    } else {
        graphic.interval().position(position).adjust(adjust)
            .color(field).label(field, () => ({
            ...label
        }));
    }
    // 专用 label
    return graphic;
}
const g2Draw = ($g, data = [], config = {}) => {
    if ($g) {
        const {
            scale = {}
        } = config;
        if (__Zn.isNotEmpty(scale)) {
            $g.scale(scale);
        }
        $g.data(data);
        $g.render();
    }
}

const g2ScaleMax = (data = [], field = "value", ratio = 0.8) => {
    const max = data
        .filter(item => undefined !== item)
        .map(item => item[field])
        .reduce((left, right) => Math.max(left, right), 0);
    if (0 === ratio) {
        return max;
    } else {
        return Math.ceil(max / ratio);
    }
}

export default {
    g2ScaleMax,
    g2Chart,
    g2Draw,
}