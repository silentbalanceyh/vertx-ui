import Hoc from './Fx.Hoc';
import Tab from './Fx.Tab';
import Q from './Fx.Query';
import Op from './Fx.Op';
import Action from './Fx.Action';

const exported = {
    ...Hoc,
    ...Action,
    // Tab Render
    configTab: Tab.render,

    // 加载数据专用方法（复杂查询）
    rxSearch: Q.search,
    rxCriteria: Q.criteria,
    // 是否更新了 $query 一系列
    testQuery: Q.is,
    testBatch: Op.isBatch,

    // 行为专用
    initAdd: Op.initAdd,
    initBatch: Op.initBatch,
    initSearch: Op.initSearch,
    initExtra: Op.initExtra
};
console.info(exported);
export default exported;