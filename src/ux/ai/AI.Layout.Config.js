import Standard from './_layout/standard';
import Adjust015 from './_layout/adjust.015';
import Adjust016 from './_layout/adjust.016';
import Half05 from './_layout/half.05';
import Filter_03 from './_layout/filter-03';
import Filter_05 from './_layout/filter-05';
import Adjust017 from './_layout/adjust.017.js';

const item = {
    // 标准布局
    1: Standard,
    // 9:15 专用布局
    0.15: Adjust015,
    // 9:15 变种，宽文字布局
    0.16: Adjust016,
    // 9:15 变种，主表单0.16，子表单专用
    0.17: Adjust017,
    // 2列专用布局（只能两列，否则报错）
    0.5: Half05,
};
// 抽屉搜索框布局
item[-0.3] = Filter_03;
// 半页面搜索框布局
item[-0.5] = Filter_05;
export default item;