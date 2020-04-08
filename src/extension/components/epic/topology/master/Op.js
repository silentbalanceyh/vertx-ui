import Ux from 'ux';
import Ex from 'ex';

const onExisting = (reference, response = {}) => {
    const state = {};
    const {nodes = [], edges = []} = reference.graphic;
    const items = Ux.g6DataTree(reference);
    state.$data = {
        nodeData: nodes,
        edgeData: edges,
        items,
    };
    state.$ready = true;
    reference.setState(state);
};
const onNew = (reference, response = {}) => {
    Ex.I.relation().then(edgeData => {
        const state = {};
        /* 基本的 items */
        const items = Ux.g6DataTree(reference);
        /* 节点 */
        const nodeData = items.map(item => item.data);
        /* 边数据 */
        state.$data = {
            nodeData,
            edgeData,
            items,
        };
        state.$ready = true;
        reference.setState(state);
    })
};

const yiPage = (reference) => {
    Ux.ajaxGet('/api/graphic/definition/master').then(response => {
        if (response.graphic) {
            onExisting(reference, response)
        } else {
            onNew(reference);
        }
    })
};
export default {
    yiPage
}