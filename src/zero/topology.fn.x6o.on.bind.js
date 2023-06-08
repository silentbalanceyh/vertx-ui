import __Zn from './zero.module.dependency';
import __Sex from './rapid.fn.sex.callback';
import __X6 from './topology.fn.x6.action';

/**
 * ##「标准」`Ux.x6oWindowClose`
 * @memberOf module:x6/zero
 * @returns {*}
 */
const x6oWindowClose = () => (edge = {}, gEvent) => {
    const graph = gEvent.g6Graph();
    graph.removeCell(edge.id);
}
/**
 * ##「标准」`Ux.x6oWindowSubmit`
 *
 * @memberOf module:x6/zero
 * @param reference
 * @returns {Function}
 */
const x6oWindowSubmit = (reference) => (params = {}, gEvent) => {
    const {openId, ...request} = params;
    const graph = gEvent.g6Graph();
    const cell = graph.getCellById(openId);
    // 设置数据
    if (cell.isEdge()) {
        cell.setData(request);
        const typeObj = __Zn.elementUniqueDatum(reference,
            "relation.type", 'code', request.type);
        if (typeObj) {
            cell.setLabels(typeObj.name);
        }
    }
}
/**
 * ##「标准」`Ux.x6oNodeRemovable`
 *
 * @memberOf module:x6/zero
 * @param reference
 * @param managed
 * @returns {Function}
 */
const x6oNodeRemovable = (reference, managed) => (cell) => {
    if (cell && cell.isNode()) {
        const nodeData = cell.getData();
        if (nodeData && managed) {
            // 只要不是当前节点就可以删除
            return nodeData.identifier !== managed.identifier;
        } else return true;
    } else {
        // 默认打开删除功能
        return true;
    }
}
/**
 * ##「标准」`Ux.x6oEdgeConnectedAfter`
 *
 * @memberOf module:x6/zero
 * @param reference
 * @returns {Function}
 */
const x6oEdgeConnectedAfter = (reference) => (edge = {}, gEvent) => {
    /*
     * 1. 打开窗口
     * 2. 构造表单初始值
     * 3. 构造数据类型
     */
    const {rxEdgeInit = () => ({})} = reference.props;
    let $inited = rxEdgeInit(edge, reference);     // 初始化边专用函数
    const state = {};
    state.$openId = edge.id;
    state.$openKey = "WIN_REL";
    gEvent.winOpen($inited, state);
}

/**
 * ##「标准」`Ux.x6oEdgeConnectedBefore`
 *
 * @memberOf module:x6/zero
 * @param reference
 * @param managed
 * @returns {Function}
 */
const x6oEdgeConnectedBefore = (reference, managed = {}) => (edge = {}, gEvent) => {
    // 1. 验证当前线 Edge 是否重复
    const graph = gEvent.g6Graph();
    const duplicated = __X6.x6IsDupEdge(edge, graph); // Op.koDuplicated(edge, gEvent);
    if (duplicated) {
        __Sex.sexMessage(reference, 'duplicated', 2);  // 3秒消息
        return false;
    }
    // 2. 验证环形，edge 的 source 和 target 相等时需要比较 reference
    const loop = __X6.x6IsLoop(edge, managed);
    if (loop) {
        __Sex.sexMessage(reference, 'loop', 2);
        return false;
    }
    // 3. 验证其他关系
    const unmanaged = __X6.x6IsUnmanaged(edge, managed);
    if (unmanaged) {
        __Sex.sexMessage(reference, 'unmanaged', 2);
        return false;
    }
    return true;
}
/**
 * ##「标准」`Ux.x6oReset`
 *
 * @memberOf module:x6/zero
 * @param reference
 * @param dataDefault
 * @returns {Function}
 */
const x6oReset = (reference, dataDefault = {}) => (request, gEvent) => {
    /*
     * 根据 dataDefault 处理默认布局信息，更新图对应数据而实现重置
     */
    __Sex.sexDialog(reference, "reset", () => {
        const graph = gEvent.g6Graph();
        graph.fromJSON(dataDefault);
    })
}
export default {
    x6oWindowClose,
    x6oWindowSubmit,
    x6oEdgeConnectedBefore,
    x6oEdgeConnectedAfter,
    x6oNodeRemovable,
    x6oReset
}