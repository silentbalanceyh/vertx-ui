import Dev from "./develop";
import {Chart} from "@antv/g2";
import Abs from './abyss';

/**
 * ## 「标准」`Ux.g2Chart`
 *
 * ### 1. 详细配置
 *
 * 配置详细数据结构
 *
 * {
 *     "chart": {},         // 图配置
 *     "tooltip": {},       // Tooltip配置
 *     "interval": {},      // 图呈现专用配置
 * }
 *
 * @memberOf module:_g
 * @param id {String} 图元关联的Div元素id
 * @param config {any} 配置属性
 */
const g2Chart = (id, config = {}) => {
    const {
        chart = {},             // 图配置
        tooltip = {},           // Tooltip配置
        interval = {},          // Interval配置
        dim = {},               // 维度配置
    } = config;
    Dev.dgDebug(config, "图配置相关信息");
    // 创建 g2 图信息
    const graphic = new Chart({
        container: id,
        autoFit: true,
        ...chart
    });
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
const g2Pie = ($g, config = {}) => {
    if ($g) {
        const {
            coordinate = {},
        } = config;
        $g.coordinate("theta", {
            radius: 0.9,
            ...coordinate
        }).transpose()
    }
}

const g2Line = ($g, config = {}) => {
    if ($g) {
        const {
            coordinate = {},
            axis = {},
            dim = {},
        } = config;
        const {
            field = "name",
            value = "value",
        } = dim;
        const configF = axis.field ? axis.field : {};
        const configV = axis.value ? axis.value : {};
        $g.axis(field, {
            ...configF,
        })
        $g.axis(value, {
            ...configV
        });
        $g.coordinate("rect", coordinate).transpose()
    }
}

const g2Bar = ($g, config = {}) => {
    if ($g) {
        const {
            axis = {},
            dim = {},
            legend = true,
        } = config;
        const {
            field = "name",
            value = "value",
        } = dim;
        const configF = axis.field ? axis.field : {};
        const configV = axis.value ? axis.value : {};
        $g.axis(field, {
            ...configF,
        })
        $g.axis(value, {
            ...configV
        });
        $g.legend(legend)
    }
}

const g2Draw = ($g, data = [], config = {}) => {
    if ($g) {
        const {
            scale = {}
        } = config;
        if (Abs.isNotEmpty(scale)) {
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
    // 创建图引用
    g2Chart,
    // Pie
    g2Pie,          // Pie
    g2Bar,          // Bar
    g2Line,         // Line
    // 图更新
    g2Draw,
    g2ScaleMax,
}