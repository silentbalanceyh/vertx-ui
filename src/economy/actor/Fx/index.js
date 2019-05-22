import Hoc from './Fx.Hoc';
import Tab from './Fx.Tab';
import Q from './Fx.Query';
import Init from './Fx.Init.Op';
import Action from './Fx.Action';
import Mock from './Fx.Mock';
import Unity from './Fx.Unity';

const exported = {
    ...Hoc,
    ...Action,
    // Tab Render
    configTab: Tab.render,

    rxCriteria: Q.criteria,
    // 是否更新了 $query 一系列
    testQuery: Q.is,
    testBatch: Init.isBatch,

    // 行为专用
    initAdd: Init.initAdd,
    initBatch: Init.initBatch,
    initSearch: Init.initSearch,
    initExtra: Init.initExtra,
    // 调用函数
    consume: Unity.consume,
    // Mock数据
    Mock,
};
console.info(exported);
export default exported;