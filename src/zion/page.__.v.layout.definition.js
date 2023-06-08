import _layout_query_0_3 from './variant-layout/embattle._.query.0.3';
import _layout_query_0_5 from './variant-layout/embattle._.query.0.5';

import layout_flow_0_101 from './variant-layout/embattle.flow.0.101';
import layout_flow_0_121 from './variant-layout/embattle.flow.0.121';

import layout_revision_0_15 from './variant-layout/embattle.revision.0.15';
import layout_revision_0_16 from './variant-layout/embattle.revision.0.16';
import layout_revision_0_17 from './variant-layout/embattle.revision.0.17';
import layout_revision_0_21 from './variant-layout/embattle.revision.0.21';

import layout_semi_0_5 from './variant-layout/embattle.semi.0.5';
import layout_semi_0_51 from './variant-layout/embattle.semi.0.51';

import layout_standard_1_1 from './variant-layout/embattle.standard.1.1';
import layout_standard from './variant-layout/embattle.standard';

const item = {

    1: layout_standard,                     // 1            标准布局
    1.1: layout_standard_1_1,               // 1.1          标准增强布局

    0.15: layout_revision_0_15,             // 0.15         9:15 专用布局
    0.16: layout_revision_0_16,             // 0.16         9:15 变种，宽文字布局
    0.17: layout_revision_0_17,             // 0.17         9:15 变种，主表单0.16，子表单专用
    0.21: layout_revision_0_21,             // 0.21         Word布局
    // 两列
    0.5: layout_semi_0_5,                   // 0.5          两列专用标准
    0.51: layout_semi_0_51,                 // 0.51         两列变种
    // 一列
    0.101: layout_flow_0_101,               // 0.101        10:14
    0.121: layout_flow_0_121,               // 0.121        12:12
};

item[-0.3] = _layout_query_0_3;             // -0.3          // 抽屉搜索框布局
item[-0.5] = _layout_query_0_5;             // -0.5          // 半页面搜索框布局
export default item;