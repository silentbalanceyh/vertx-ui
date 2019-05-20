import Hoc from './Fx.Hoc';
import Tab from './Fx.Tab';
import Table from './Fx.Table';
import Q from './Fx.Query';
import Op from './Fx.Op';

const exported = {
    ...Hoc,

    // Tab Render
    configTab: Tab.render,
    // Table Render
    configTable: Table.render,
    initTable: Table.init,

    // 加载数据专用方法（复杂查询）
    rxSearch: Q.search,
    // 是否更新了 $query 一系列
    testQuery: Q.is,

    // 行为专用
    initAdd: Op.initAdd,
};
console.info(exported);
export default exported;