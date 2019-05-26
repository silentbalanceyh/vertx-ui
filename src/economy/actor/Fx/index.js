import Hoc from './Fx.Hoc';
import Tab from './Fx.Tab';
import Q from './Fx.Query';
import Init from './Fx.Init.Op';
import Jsx from './Fx.UI';
import Dialog from './Fx.Init.Dialog';
import Projection from './Fx.Projection';
import Action from './Fx.Event';
import Mock from './Fx.Mock';
import Unity from './Fx.Unity';

const exported = {
    ...Hoc,
    ...Action,
    // Tab Render
    configTab: Tab.render,

    // 列处理，垂直映射处理（列过滤专用）
    mapColumns: Projection.initColumns,
    mapOptions: Projection.initOptions,
    mapFields: Projection.initFields,

    rxCriteria: Q.criteria,
    // 是否更新了 $query 一系列
    testQuery: Q.is,
    testBatch: Init.isBatch,

    // 行为专用
    initAdd: Init.initAdd,
    initBatch: Init.initBatch,
    initSearch: Init.initSearch,
    initExtra: Init.initExtra,
    // 窗口专用
    initDialog: Dialog.init,

    jsxDialog: Jsx.jsxDialog,
    jsxComponent: Jsx.jsxComponent,
    // 调用函数
    doLoading: Unity.doLoading,
    doRefresh: Unity.doRefresh,
    doSubmit: Unity.doSubmit,
    doClose: Unity.doClose,
    // Css
    cssGrid: Jsx.cssGrid,
    // Mock数据
    Mock,
};
console.info(exported);
export default exported;