import Hoc from './Fx.Hoc';
import Tab from './Fx.Tab';
import Query from './Fx.Query';
import Is from './Fx.Is';

const exported = {
    ...Hoc,
    // Tab Render
    configTab: Tab.render,
    // 加载数据专用方法（复杂查询）
    rxSearch: Query.search,
    // 是否更新了 $query 一系列
    testQuery: Is.isQuery,
};
console.info(exported);
export default exported;