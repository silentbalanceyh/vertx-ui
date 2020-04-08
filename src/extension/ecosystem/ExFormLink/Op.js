import Ux from 'ux';

const $opSaveEdge = (reference) => (params = {}) => {
    const {rxEdgeAdd} = reference.props;
    if (Ux.isFunction(rxEdgeAdd)) {
        rxEdgeAdd(params);
    }
};
export default {
    actions: {
        $opSaveEdge
    }
}