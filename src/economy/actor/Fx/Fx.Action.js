import Etat from './Fx.Etat';
import Ux from 'ux';
import Q from './Fx.Query';
import Mock from './Fx.Mock';
import Cond from './Fx.Condition';
import Inherit from './Fx.Action.Inherit';
import Unity from './Fx.Unity';

const rxAddTab = reference => event => {
    // 添加按钮
    event.preventDefault();
    const view = Etat.View.switch(reference, "add", undefined);
    const tabs = Etat.Tab.add(reference);
    reference.setState({tabs, ...view});
};
/* 这里的 reference 是 IxTable */
const rxEdit = (reference, id) => {
    reference.setState({$loading: true});
    Ux.toLoading(() => {
        // 读取记录
        const {$options = {}} = reference.props;
        const uri = $options['ajax.get.uri'];
        Ux.ajaxGet(uri, {id}, Mock.mockGet(reference, id))
            .then(data => {
                /* 本层引用处理 */
                reference.setState({$loading: false});
                /* 上层引用处理 */
                const ref = Ux.onReference(reference, 1);
                const view = Etat.View.switch(ref, "edit", id);
                const tabs = Etat.Tab.edit(ref, data);
                Unity.consume(reference, 'fnInit')(fnInit => fnInit(data, {tabs, ...view}));
            })
    })
};
/* 这里的 reference 是 IxTable */
const rxDelete = (reference, id) => {
    reference.setState({$loading: true});
    Ux.toLoading(() => {
        // 删除记录
        const {$options = {}} = reference.props;
        const uri = $options['ajax.delete.uri'];
        Ux.ajaxDelete(uri, {id}, Mock.mockDelete(reference, id))
            .then(deleted => {
                if (deleted) {
                    rxRefresh(reference);
                } else {
                    throw new Error(`[Ox] 删除有问题 id = ${id}`);
                }
            })
    });
};
/* 这里的 reference 是 IxTable */
const rxRefresh = (reference) => {
    const query = Cond.initFilters(reference);
    rxSearch(reference, query.to());
};
/* 这里的 reference 是 IxTable */
const rxChange = (reference) => (pagination, filters, sorter) => {
    reference.setState({
        $loading: true,
        // 专用 $condition，用于列定义，这里不更新 $condition， 会导致问题
        $condition: filters,
        // FIX：带有 filters 的列同时使用排序和过滤时的排序不生效的问题
        $sorter: sorter
    });
    Ux.dgDebug({
        pagination,
        filters,
        sorter
    }, "[Ex] 改变条件专用事件");
    Ux.toLoading(() => {
        const params = Q.criteria(reference)(pagination, filters, sorter);
        Unity.consume(reference, 'fnQuery')(fnQuery => fnQuery(params));
    })
};
/* ExComplexList 引用 */
const rxEditTab = (reference) => (key, action) => {
    if ("remove" === action) {
        const state = Etat.Tab.remove(reference, key);
        reference.setState(state);
    }
};
/* ExComplexList 引用 */
const rxClickTab = reference => key => {
    const state = Etat.Tab.click(reference, key);
    reference.setState(state);
};
/* ExComplexList 引用 */
const rxClose = (reference, key) => {
    const state = Etat.Tab.close(reference, key);
    reference.setState(state);
};
const rxSearch = (reference, query = {}) =>
    Unity.consume(reference, 'fnSearch')(fnSearch => fnSearch(query)
        .then(Mock.mockSearchResult(reference, query))
        .then(data => reference.setState({
            data,
            $loading: false // 和分页专用统一
        })));
export default {
    rxAddTab,   // 添加按钮
    rxEditTab,  // 编辑 Tab，主要处理关闭
    rxClickTab, // 移动 Tab 页，选择某个页
    rxClose,    // 关闭某个 Tab页
    rxChange,   // 表格发生变更（分页、排序、页尺寸改变、列变更）
    rxRefresh,  // 刷新表格专用方法
    rxSearch,   // 搜索专用方法

    rxEdit,
    rxDelete,   // 行删除


    ...Inherit
};