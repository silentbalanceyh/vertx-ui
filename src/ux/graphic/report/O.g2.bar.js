import {Chart} from "@antv/g2";
import Dev from '../../develop';

export default (id, config = {}) => {
    const {
        chart = {},             // 图配置
        coordinate = {},        // Coordinate配置
        tooltip = {},           // Tooltip配置
        interval = {},          // Interval配置
    } = config;
    Dev.dgDebug(config, "图配置相关信息")

    // 创建 g2 的图信息
    const graphic = new Chart({
        container: id,
        autoFit: true,
        ...chart,
    });

    // 处理标记
    graphic.coordinate('theta', {
        radius: 0.9,
        ...coordinate
    });
    graphic.tooltip({
        showMarkers: false,
        showTitle: false,
        ...tooltip,
    });

    // Interval
    const {
        adjust = "stack",       // .adjust
        position = "value",     // .position
        color = "type",         // .color,
        // 特殊字段
        isPercent,              // 是否使用百分比模式
    } = interval;


    // percent
    if (isPercent) {
        graphic.scale(position, {
            formatter: (val) => val * 100 + '%'
        })
    }

    graphic.interval().position(position).adjust(adjust).color(color);
    return graphic;
}