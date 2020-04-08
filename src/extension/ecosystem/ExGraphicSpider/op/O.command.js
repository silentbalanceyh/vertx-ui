import Ux from 'ux';
/*
 * {
 *     "graphic": {
 *         "edges": [],
 *         "nodes": []
 *     },
 *     "removed": [key1, key2],
 *     "relation": [
 *
 *     ]
 * }
 */
const getRequest = (edges = [], nodes = [], reference) => {
    const {$relations = []} = reference.state;
    const {$current = {}} = reference.props;
    /*
     * 判断当前 edge 边界是添加还是删除
     */
    const request = {};
    const relation = [];
    /*
     * 构造原始 key 集合
     */
    const original = new Set();
    $relations.forEach(relation => original.add(relation.key));
    request.graphic = {edges: [], nodes: []};
    edges.forEach(edge => {
        const model = edge.getModel();
        const itKey = model.id;
        original.delete(itKey);
        relation.push(Ux.g6DataEdge(edge, reference));
        request.graphic.edges.push(Ux.clone(model));
    });
    request.removed = Array.from(original);
    request.relation = relation;
    nodes.forEach(node => {
        const model = node.getModel();
        request.graphic.nodes.push(model);
    });
    request.model = $current.key;
    return request;
};
export default {
    /*
     * 二阶函数
     */
    save: (gEvent) => () => {
        const reference = gEvent.reference();
        reference.setState({$submitting: true});
        /*
         *  节点 nodes 和 边 edges
         */
        const {nodes = [], edges = []} = gEvent.dataGraph();
        /*
         * 构造两种信息
         * 1. MRelation 表的信息：增删改
         * 2. Spider 信息
         */
        const request = getRequest(edges, nodes, reference);
        /*
         * 构造特殊的数据结构
         */
        return Ux.ajaxPost(`/api/relation/definition`, request)
            .then(() => Ux.sexDialog(reference, "submitted",
                () => reference.setState({$submitting: false})))
    }
}