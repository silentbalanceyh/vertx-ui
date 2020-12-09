/*
 * 验证当前的边是否存在重复
 */
const x6IsDupEdge = (edge, graph) => {
    if (edge) {
        const source = edge.getSourceNode();
        const target = edge.getTargetNode();
        // 读取图中所有的节点
        const found = graph.getEdges()
            // 过滤掉自身
            .filter(each => each.id !== edge.id)
            .filter(each => {
                const nodeSrc = each.getSourceNode();
                return (nodeSrc && source) ? source.id === nodeSrc.id : false;
            })
            .filter(each => {
                const nodeTag = each.getTargetNode();
                return (nodeTag && target) ? target.id === nodeTag.id : false;
            })
            // 这里需要执行数据信息
            .length;
        // 找到对应信息，则边线重复
        return (0 < found);
    } else {
        throw new Error("对不起，元素不可为空！！");
    }
}
const x6IsFree = (graph) => {
    const nodes = graph.getNodes();
    const edges = graph.getEdges();
    // 从节点计算
    const nodeSet = new Set();
    nodes.forEach(node => nodeSet.add(node.id));
    // 从边计算
    edges.forEach(edge => {
        const source = edge.getSourceNode();
        const target = edge.getTargetNode();
        nodeSet.delete(source.id);
        nodeSet.delete(target.id);
    });
    // 计算最终结果
    return (0 < Array.from(nodeSet).length)
}
export default {
    /**
     * 当前这条边是否重复的边
     */
    x6IsDupEdge,
    x6IsFree,
}