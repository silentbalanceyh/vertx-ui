import Ux from 'ux';
import Ex from 'ex';

export default (reference) => {
    const state = {};
    state.$ready = true;
    const {$inited = {}} = reference.props;
    const items = Ux.g6DataTree(reference);
    const {nodes = [], edges = []} = $inited;
    /*
     * 计算当前节点
     */
    const models = Ux.g6DataTree(reference);
    const current = Ux.elementUnique(models
        .map(item => item.data), 'identifier', $inited.modelId);
    let $current = {};
    if (current) {
        $current = current;
    }
    if (0 < nodes.length && 0 < edges.length) {
        /*
         * 交换专用
         */
        $current.graphic = {
            nodes, edges,
        }
    }
    state.$current = $current;

    state.$data = {
        nodeData: nodes,
        edgeData: edges,
        items,
    };
    Ex.I.relation().then(relations => {
        state.$autoLink = relations;
        reference.setState(state);
    });

}