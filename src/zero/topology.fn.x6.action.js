/**
 * ##「标准」`Ux.x6FromTo`
 *
 * @memberOf module:x6/zero
 * @param edge
 * @param field
 * @returns {*}
 */
const x6FromTo = (edge, field) => {
    const source = edge.getSourceNode().getData();
    const target = edge.getTargetNode().getData();
    if (source && target) {
        if (field) {
            // 有字段名，则提取字段名处理
            return [source[field], target[field]];
        } else {
            // 无字段名，直接提取节点信息
            return [source, target];
        }
    } else {
        // 返回两个 undefined
        return [undefined, undefined];
    }
}
/**
 * ##「标准」`Ux.x6IsFree`
 * @memberOf module:x6/zero
 * @param graph
 * @returns {boolean}
 */
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
/**
 * ##「标准」`Ux.x6IsDupEdge`
 * @memberOf module:x6/zero
 * @param edge
 * @param graph
 * @returns {boolean}
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
/**
 * ##「标准」`Ux.x6IsLoop`
 * @memberOf module:x6/zero
 * @param edge
 * @param managed
 * @returns {boolean}
 */
const x6IsLoop = (edge, managed = {}) => {
    const [source, target] = x6FromTo(edge, 'identifier')
    if (source === target) {
        return (source !== managed.identifier)
    } else return false;
}
/**
 * ##「标准」`Ux.x6IsUnmanaged`
 * @memberOf module:x6/zero
 * @param edge
 * @param managed
 * @returns {boolean}
 */
const x6IsUnmanaged = (edge, managed = {}) => {
    const [source, target] = x6FromTo(edge, 'identifier');
    const identifier = managed.identifier;
    return (source !== identifier && target !== identifier);
}
export default {
    x6FromTo,
    x6IsFree,
    x6IsLoop,
    x6IsUnmanaged,
    x6IsDupEdge,
}