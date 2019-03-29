import G2 from '@antv/g2';
import Ct from '../draw/G2.Ds';
// 关闭 G2 的体验改进计划打点请求
const aiChartBar = (container, dataSource, chartConfig = {}) => {
    const result = Ct.dsBar(dataSource, chartConfig);
    const dataView = result.data;
    const config = result.config;
    const chart = new G2.Chart({
        container,
        forceFit: true
    });
    chart.source(dataView);
    chart.interval().position(config.position).color(config.color).adjust({
        type: 'dodge',
        marginRatio: 1 / 16
    });
    chart.render();
};

const aiChartRadial = (container, dataSource, chartConfig = {}) => {
    const result = Ct.dsRadial(dataSource, chartConfig);
    const dataView = result.data;
    const config = result.config;
    const chart = new G2.Chart({
        container,
        forceFit: true
    });
    chart.source(dataView, chartConfig.score);
    chart.coord('polar', {
        radius: 0.9
    });
    chart.axis('value', {
        line: null,
        tickLine: null,
        grid: {
            type: 'polygon',
            lineStyle: {
                lineDash: null
            }
        }
    });
    chart.legend('key', {
        marker: 'circle',
        offset: 30
    });
    chart.line().position(config.position).color(config.color).size(2);
    chart.point().position(config.position).color(config.color).shape('circle').size(4).style({
        stroke: '#fff',
        lineWidth: 1,
        fillOpacity: 1
    });
    chart.area().position(config.position).color(config.color);
    chart.render();
};
export default {
    aiChartBar,
    aiChartRadial
};