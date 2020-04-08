import drawTree from './drawer/O.g6.tree';
import drawFlow from './drawer/O.g6.flow';
import drawBar from './drawer/O.g2.bar';
import drawBarGroup from './drawer/O.g2.bar.group';
import drawAxis from './drawer/O.g2.axis';
import drawRadial from './drawer/O.g2.radial';
import drawPie from './drawer/O.g2.pie';
import g6 from './editor';

export default {
    drawTree,       // g6 树图
    drawFlow,       // g6 流程图
    drawBar,        // g2 条形图
    drawBarGroup,   // g2 分组条形图
    drawAxis,       // g2 柱状图
    drawRadial,     // g2 雷达图
    drawPie,        // g2 饼状图
    ...g6,
}