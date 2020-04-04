/*
 * 父子级不可创建关系
 * 1）计算结果为非法
 */
import Ux from 'ux';

const onAfterConnect = (gEvent) => (params = {}) => {
    const {edge} = params;
    const fnFailure = (key = "") => {
        Ux.sexMessage(gEvent.reference(), key, 2);
        const model = edge.getModel();
        gEvent.g6Remove(model);
    };
    const source = Ux.g6GetEdge(edge);
    if (Ux.g6IsInherit(source)) {
        fnFailure("forbidden");
        return false;
    }
    if (Ux.g6IsCurrent(source, gEvent.reference())) {
        fnFailure("direction");
        return false;
    }
    if (Ux.g6IsUnique(source, gEvent.graph())) {
        fnFailure("unique");
        return false;
    }
    return true;
};
const onNodeRemove = (gEvent) => (params = {}) => {
    /* 删除节点时候和当前节点一致 */
    const current = gEvent.dataCurrent();
    const {model = {}, hide} = params;

    /* 如果节点不一致则返回 true，不论是否删除都隐藏 */
    if (Ux.isFunction(hide)) {
        hide();
    }
    const {data = {}} = model;
    if (data.identifier === current.identifier) {
        Ux.sexMessage(gEvent.reference(), "current", 2);
        return false;
    } else return true;
};
const onAfterEachAnchorActive = (gEvent) => (params = {}) => {
    const {source, target} = params;
    const sourceData = Ux.g6GetNode(source);
    const targetData = Ux.g6GetNode(target);
    const input = {sourceData, targetData};
    return Ux.g6IsInherit(input)
        || Ux.g6IsCurrent(input, gEvent.reference())
        || Ux.g6IsUnique(input, gEvent.graph());
};
const save = (gEvent) => (params = {}) => {
    const data = gEvent.dataGraph();
    const {nodes = [], edges = []} = data;
    if (Ux.g6IsFree(nodes, edges)) {
        Ux.sexMessage(gEvent.reference(), "validated", 2);
        return false;
    } else return true;
};
export default {
    save,
    /*
     * 连接判断函数
     * true —— 由于条件限制不可连接
     * （Success）false —— 连接成功
     */
    onAfterConnect,
    /*
     * 确认删除的判断函数
     * （Success）true —— 删除成功
     * false —— 不可删除
     */
    onNodeRemove,
    /*
     * 激活 Anchor 锚点的判断函数
     * true —— 限制激活
     * （Success）false —— 直接激活，不执行 executor
     */
    onAfterEachAnchorActive,
}