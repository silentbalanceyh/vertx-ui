import Ex from 'ex';

const isInherit = (source) => {
    if (source) {
        const {sourceData, targetData} = source;
        return (sourceData.key === targetData.parentId)
            || (targetData.key === sourceData.parentId);
    } else return false;
};
/*
 * 只能管理当前节点
 */
const isNonCurrent = (source, reference) => {
    if (source && reference) {
        const {sourceData, targetData} = source;
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
 * 只能创建一条关系
 */
const isOnlyOne = (source, graph) => {
    if (source && graph) {
        const edges = graph.getEdges();
        const {sourceData, targetData} = source;
        /*
         * 查找关系中包含了 sourceData.key, targetData.key 的数据
         */
        const counter = edges.filter(eachEdge => {
            const data = Ex.g6EdgeData(eachEdge);
            const source = data.sourceData;
            const target = data.targetData;
            if (source.key === sourceData.key) {
                return target.key === targetData.key;
            } else if (source.key === targetData.key) {
                return target.key === sourceData.key;
            } else return false;
        }).length;
        return 1 < counter;
    } else return false;
};
export default {
    isOnlyOne,
    isInherit,
    isNonCurrent,
}