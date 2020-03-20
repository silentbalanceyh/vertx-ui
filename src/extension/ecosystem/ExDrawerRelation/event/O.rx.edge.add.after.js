import Ex from 'ex';
import Is from './O.common';

export default (reference) => (node = {}) => {
    const {edge, graph} = node;
    if (edge) {
        /*
         * 撤销处理和提交处理
         */
        if (Is.edgeValidate(reference, edge, graph)) {

            const exEdgeAdd = (label = "") => {
                const model = edge.getModel();
                model.label = label;
                edge.update(model);
                edge.refresh();
            };
            const exEdgeCancel = () => {
                const model = edge.getModel();
                Ex.g6ItemRemove(graph, model);
            };
            reference.setState({
                $visible: true,
                $inited: Is.edgeInit(edge),
                $supplier: {
                    exEdgeCancel,
                    exEdgeAdd
                }
            });
        }
    }
}