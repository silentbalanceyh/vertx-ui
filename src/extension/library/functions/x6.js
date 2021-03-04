import Ux from "ux";
import Is from "./graphic/g.x6.is";
/*
 * 判断自我关系的合法性
 * 1）如果是自引用只可当前节点
 * 2）其他节点不可创建自引用
 */
const isLoopOk = (edge, managed = {}) => {
    const [source, target] = Ux.x6FromTo(edge, 'identifier')
    if (source === target) {
        return (source !== managed.identifier)
    } else return false;
}
/*
 * 其他节点不可创建关系
 */
const isUnmanaged = (edge, managed = {}) => {
    const [source, target] = Ux.x6FromTo(edge, 'identifier');
    const identifier = managed.identifier;
    return (source !== identifier && target !== identifier);
}
const rxEdgeInit = (edge, reference) => {
    const $inited = {};
    $inited.key = Ux.randomUUID();
    {
        const [upstream, downstream] = Ux.x6FromTo(edge, 'identifier');
        $inited.upstream = upstream;
        $inited.downstream = downstream;
        // 读取 upstreamName / downstreamName
        const up = Ux.elementUniqueDatum(reference,
            'resource.models', 'identifier', upstream);
        if (up) {
            $inited.upstreamName = up.alias;
        }
        const down = Ux.elementUniqueDatum(reference,
            'resource.models', 'identifier', downstream);
        if (down) {
            $inited.downstreamName = down.alias;
        }
        $inited.active = true;
        const source = edge.getSourceNode().getData();
        if (source) {
            // sigma / language 环境信息处理
            $inited.sigma = source.sigma;
            $inited.language = Ux.Env['LANGUAGE'];
        }
    }
    return $inited;
};
const rxEdgeInitType = (reference) => (edge = []) => {
    const typeObj = Ux.elementUniqueDatum(reference, "relation.type", 'code', edge.type);
    if (typeObj) {
        edge.name = typeObj.name;
    }
    return edge;
};
const rxNodeFilter = (reference) => (node, gEvent) => {
    const data = node.getData();
    if (data) {
        const itemKo = gEvent.nodeData("identifier");
        return !itemKo.has(data.identifier);
    } else return true;
}
// =====================================================
// on 前缀
// =====================================================
const onWindowClose = () => (edge = {}, gEvent) => {
    const graph = gEvent.g6Graph();
    graph.removeCell(edge.id);
}
const onWindowSubmit = (reference) => (params = {}, gEvent) => {
    const {openId, ...request} = params;
    const graph = gEvent.g6Graph();
    const cell = graph.getCellById(openId);
    // 设置数据
    if (cell.isEdge()) {
        cell.setData(request);
        const typeObj = Ux.elementUniqueDatum(reference,
            "relation.type", 'code', request.type);
        if (typeObj) {
            cell.setLabels(typeObj.name);
        }
    }
}
const onNodeRemovable = (reference, managed) => (cell) => {
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
const onEdgeConnectedAfter = (reference) => (edge = {}, gEvent) => {
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
/*
 * 验证当前连接的这条线是否合法
 */
const onEdgeConnectedBefore = (reference, managed = {}) => (edge = {}, gEvent) => {
    // 1. 验证当前线 Edge 是否重复
    const graph = gEvent.g6Graph();
    const duplicated = Ux.x6IsDupEdge(edge, graph); // Op.koDuplicated(edge, gEvent);
    if (duplicated) {
        Ux.sexMessage(reference, 'duplicated', 2);  // 3秒消息
        return false;
    }
    // 2. 验证环形，edge 的 source 和 target 相等时需要比较 reference
    const loop = Is.isLoopOk(edge, managed);
    if (loop) {
        Ux.sexMessage(reference, 'loop', 2);
        return false;
    }
    // 3. 验证其他关系
    const unmanaged = Is.isUnmanaged(edge, managed);
    if (unmanaged) {
        Ux.sexMessage(reference, 'unmanaged', 2);
        return false;
    }
    return true;
}
const onReset = (reference, dataDefault = {}) => (request, gEvent) => {
    /*
     * 根据 dataDefault 处理默认布局信息，更新图对应数据而实现重置
     */
    Ux.sexDialog(reference, "reset", () => {
        const graph = gEvent.g6Graph();
        graph.fromJSON(dataDefault);
    })
}
export default {
    // 窗口关闭专用函数
    onWindowClose,
    // 窗口提交专用函数
    onWindowSubmit,
    // 移除按钮
    onNodeRemovable,
    // 连接之后调用
    onEdgeConnectedAfter,
    // 连接之前调用
    onEdgeConnectedBefore,
    // 重置专用函数
    onReset,
    // rx 系列,
    rxEdgeInit,
    rxEdgeInitType,
    rxNodeFilter,
    // is 系列
    isLoopOk,
    isUnmanaged,
}