import Etat from './Fx.Etat';
import Ux from 'ux';
import Q from './Fx.Query';

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
const rxChange = (reference) => (pagination, filters, sorter) => {
    // ExComplexList 引用
    /*
     * 条件来自几部分
     * 1.
     **/
    const startState = {
        $loading: true,
        // 专用 $condition
        $condition: filters
    };
    reference.setState(startState);
    Ux.toLoading(() => {
        const params = Q.criteria(reference)(pagination, filters, sorter);
        const {rxSearch} = reference.props;
        console.info(params);
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
};