import g6Editor from './editor';
import g6Graph from './drawer';
import g2Drawer from './report';

export default {
    // drawTree,       // g6 树图
    // drawFlow,       // g6 流程图
    // drawBar,        // g2 条形图
    // drawBarGroup,   // g2 分组条形图
    // drawAxis,       // g2 柱状图
    // drawRadial,     // g2 雷达图
    // drawPie,        // g2 饼状图
    ...g6Editor,
    ...g6Graph,
    ...g2Drawer,
}