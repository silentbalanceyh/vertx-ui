import Etat from './Fx.Etat';

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

};
const rxEditTab = (reference) => (key, action) => {
    if ("remove" === action) {
        const state = Etat.Tab.remove(reference, key);
        reference.setState(state);
    }
};
const rxClickTab = reference => key => {
    const state = Etat.Tab.click(reference, key);
    reference.setState(state);
};
const rxClose = (reference, key) => {
    const state = Etat.Tab.close(reference, key);
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
}