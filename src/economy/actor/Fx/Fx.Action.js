import Etat from './Fx.Etat';
import Ux from 'ux';
import U from 'underscore';
import Q from './Fx.Query';
import Inherit from './Fx.Action.Inherit';

const rxAddTab = reference => event => {
    // 添加按钮
    event.preventDefault();
    const view = Etat.View.switch(reference, "add", undefined);
    const tabs = Etat.Tab.add(reference);
    reference.setState({tabs, ...view});
};
const rxEdit = (reference, id) => {
    // 编辑按钮
};
const rxDelete = (reference, id) => {
    // 删除记录
};
/*
 * 这里的 reference 是 IxTable
 */
const rxChange = (reference) => (pagination, filters, sorter) => {
    // ExComplexList 引用
    /*
     * 条件来自几部分
     * 1.
     **/
    const startState = {
        $loading: true,
        // 专用 $condition，用于列定义，这里不更新 $condition， 会导致问题
        $condition: filters,
        // FIX：带有 filters 的列同时使用排序和过滤时的排序不生效的问题
        $sorter: sorter
    };
    reference.setState(startState);
    Ux.dgDebug({
        pagination,
        filters,
        sorter
    }, "[Ex] 改变条件专用事件");
    Ux.toLoading(() => {
        const params = Q.criteria(reference)(pagination, filters, sorter);
        const {fnQuery} = reference.props;
        if (U.isFunction(fnQuery)) {
            fnQuery(params);
        }
    })
};
const rxEditTab = (reference) => (key, action) => {
    if ("remove" === action) {
        const state = Etat.Tab.remove(reference, key);
        // ExComplexList 引用
        reference.setState(state);
    }
};
const rxClickTab = reference => key => {
    const state = Etat.Tab.click(reference, key);
    // ExComplexList 引用
    reference.setState(state);
};
const rxClose = (reference, key) => {
    const state = Etat.Tab.close(reference, key);
    // ExComplexList 引用
    reference.setState(state);
};
export default {
    rxAddTab,

    rxEditTab,

    rxClickTab,

    rxEdit,

    rxDelete,

    rxChange,

    rxClose,

    ...Inherit
};