/*
 * 判断两点是否具有父子关系
 * 1) 默认返回 false（非父子关系）
 * 2) 如果有父子关系则直接返回　true
 */
import T from "./O.node.js";
import Ux from "ux";

const g6IsInherit = (edgeData) => {
    if (edgeData) {
        const {sourceData, targetData} = edgeData;
        return (sourceData.key === targetData.parentId)
            || (targetData.key === sourceData.parentId);
    } else return false;
};
/*
 * 判断是否当前节点
 * 1）默认不是当前节点
 * 2）判断过后如果是当前节点
 */
const g6IsCurrent = (edgeData, reference) => {
    if (edgeData && reference) {
        const {sourceData, targetData} = edgeData;
        const {$current = {}} = reference.props;
        if (sourceData.key === $current.key) {
            /*
             * targetData必须不是当前
             */
            return targetData.key === $current.key;
        } else {
            /*
             * targetData必须是当前
             */
            return targetData.key !== $current.key;
        }
    } else return false;
};
/*
 * 是否游离点
 */
const g6IsFree = (nodes, edges) => {
    /*
     * 检查游离的点
     */
    const idSet = new Set();
    edges.forEach(edge => {
        const source = T.g6GetNode(edge.getSource());
        const target = T.g6GetNode(edge.getTarget());
        idSet.add(source.key);
        idSet.add(target.key);
    });
    /*
     * 过滤所有的点
     */
    const $ids = Ux.immutable(Array.from(idSet));
    const counter = nodes.filter(node => {
        const data = T.g6GetNode(node);
        return !$ids.contains(data.key);
    }).length;
    return 0 < counter;
};
/*
 * 两点之间是否唯一关系
 */
const g6IsUnique = (edgeData, graph) => {
    if (edgeData && graph) {
        const edges = graph.getEdges();
        const {sourceData, targetData} = edgeData;
        /*
         * 查找关系中包含了 sourceData.key, targetData.key 的数据
         */
        const counter = edges.filter(eachEdge => {
            const data = T.g6GetEdge(eachEdge);
            const source = data.sourceData;
            const target = data.targetData;
            if (source['key'] === sourceData.key) {
                return target['key'] === targetData.key;
            } else if (source['key'] === targetData.key) {
                return target['key'] === sourceData.key;
            } else return false;
        }).length;
        return 1 < counter;
    } else return false;
};

export default {
    g6IsInherit,
    g6IsCurrent,
    g6IsFree,
    g6IsUnique
}