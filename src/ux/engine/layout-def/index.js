import Standard from './standard';
import Standard11 from './standard.11';
import Adjust015 from './adjust.015';
import Adjust016 from './adjust.016';

import Filter_03 from './filter.03';
import Filter_05 from './filter.05';

import Adjust017 from './adjust.017';
import Adjust021 from './adjust.021';

import Half05 from './half.05';
import Half051 from './half.051';

import OneHalf from './one.12';
import OneWidth from './one.10';

const item = {
    // 标准布局
    1: Standard,
    1.1: Standard11,
    // 9:15 专用布局
    0.15: Adjust015,
    // 9:15 变种，宽文字布局
    0.16: Adjust016,
    // 9:15 变种，主表单0.16，子表单专用
    0.17: Adjust017,
    // 2列专用布局（只能两列，否则报错）
    0.5: Half05,
    // 2列专用布局
    0.51: Half051,
    // Word布局
    0.21: Adjust021,

    // -------------- 后续布局规范 ------------
    // 一列 12:12
    0.121: OneHalf,
    // 一列 10:14
    0.101: OneWidth,
};
// 抽屉搜索框布局
item[-0.3] = Filter_03;
// 半页面搜索框布局
item[-0.5] = Filter_05;
export default item;