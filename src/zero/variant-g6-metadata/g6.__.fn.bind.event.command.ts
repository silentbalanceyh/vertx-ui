import {OptionKey} from "./g6.__.v.enum.constant";
import __Zn from './zero.uca.dependency';

const Ld = __Zn.G6_LIBRARY;
// --------------------- 核心逻辑
const __onNodeReload = (gEvent, cell) => {
    const data = cell.getData();
    if (data) {
        const {__group} = data;
        if (__group) {
            const groupName = __Zn.encryptMD5(__group);
            gEvent.stencilReload(groupName);
        }
    }
}
const __onClickRemove = (gEvent, cell) => () => {
    const options = gEvent.nodeOptions();
    const config = options[OptionKey.MESSAGE_CONFIRM];
    const {node, edge, ...rest} = config;
    const content = cell.isNode() ? node : edge;
    // 隐藏语法部分的问题
    // @ts-ignore
    const md = __Zn.v4Modal()
    md.confirm({
        ...rest,
        content,
        onOk: () => {
            const graph = gEvent.g6Graph();
            graph.removeCell(cell.id);
        }
    })
}
const __edgeAddTool = (gEvent, cell) => {
    cell.addTools([{
        name: 'source-arrowhead',           // 开始节点
        args: Ld.V.CI_ARROW_SOURCE
    }, {
        name: 'target-arrowhead',           // 结束节点
        args: Ld.V.CI_ARROW_TARGET
    }, {
        name: 'button-remove',
        args: {
            ...Ld.V.CI_BUTTON_NODE,
            onClick: __onClickRemove(gEvent, cell)
        }
    }])
}
const __nodeAddTool = (gEvent, cell) => {
    cell.addTools([{
        name: 'button-remove',
        args: {
            ...Ld.V.CI_BUTTON_NODE,
            onClick: __onClickRemove(gEvent, cell)
        }
    }])
}
// --------------------- 核心函数
const bindCombine = (arrayFun = []) => (gEvent, params) =>
    arrayFun.filter(each => __Zn.isFunction(each)).forEach(executor => {
        executor(gEvent, params);
    });

const __bindEdgeAddon = (gEvent, params) => {
    const {cell} = params;
    if (cell.isEdge()) {
        // AOP：限制边删除
        const okRemove = gEvent.onEdgeRemovable(cell);
        if (okRemove) {
            __edgeAddTool(gEvent, cell);
        }
    }
}
const __bindPortShow = (gEvent, params: any = {}) => {
    const {show = true} = params;
    const container = gEvent.g6Container() as any;
    // 读取所有的 Port 对象
    let ports = container.querySelectorAll('.x6-port-body');
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden';
    }
}
const __bindToolRemove = (gEvent, {cell}) => cell.removeTools();

const __bindEdgeConnected = (gEvent, params) => {
    const {edge, isNew} = params;
    if (isNew) {
        // AOP: 连接前置函数
        const verified = gEvent.onEdgeConnectedBefore(edge);
        // 必须是布尔执行，否则这里会错
        if (verified) {
            // AOP：连接后置函数（连接成功）
            gEvent.onEdgeConnectedAfter(edge);
        } else {
            // 连接失败，删除当前连接
            const g6Graph = gEvent.g6Graph();
            g6Graph.removeCell(edge.id);
        }
    }
}
const __bindNodeAddon = (gEvent, params) => {
    const {cell} = params;
    if (cell.isNode()) {
        // AOP：限制节点删除
        const okRemove = gEvent.onNodeRemovable(cell);
        if (okRemove) {
            __nodeAddTool(gEvent, cell);
        }
    }
}

const __bindNodeAdd = (gEvent, params) => {
    const {cell} = params;
    if (cell.isNode()) {
        __onNodeReload(gEvent, cell);
    }
}
const __bindNodeRemove = (gEvent, params) => {
    const {cell} = params;
    if (cell.isNode()) {
        __onNodeReload(gEvent, cell);
    }
}
const __bindNodeClick = (gEvent, params) => {
    const {cell} = params;
    if (cell.isNode()) {
        const {double = false} = params;
        if (double) {
            gEvent.onNodeClickDouble(cell);
        } else {
            gEvent.onNodeClick(cell);
        }
    }
}
export default {
    /**
     * 合并专用函数，将多个函数合并到一起，构造函数链
     * [
     *      function1,
     *      function2,
     *      ....
     * ]
     */
    bindCombine,

    /**
     * 添加边相关按钮，在边上增加工具
     * 1）起点
     * 2）终点
     * 3）删除按钮
     */
    bindEdgeAddon: (gEvent) => (params) =>
        __bindEdgeAddon(gEvent, params),

    /**
     * 添加节点相关按钮，在节点上增加工具
     * 1）删除按钮
     */
    bindNodeAddon: (gEvent) => (params) =>
        __bindNodeAddon(gEvent, params),

    /**
     * 显示和隐藏连接桩的隐藏和显示
     */
    bindPortShow: (gEvent, show = true) => (params) =>
        __bindPortShow(gEvent, {show, ...params}),

    /**
     * 连接专用处理
     */
    bindEdgeConnected: (gEvent) => (params) =>
        __bindEdgeConnected(gEvent, params),

    /**
     * 移除工具专用
     */
    bindToolRemove: (gEvent) => (params) =>
        __bindToolRemove(gEvent, params),
    /*
     * 节点专用
     */
    bindNodeAdd: (gEvent) => (params) =>
        __bindNodeAdd(gEvent, params),
    bindNodeRemove: (gEvent) => (params) =>
        __bindNodeRemove(gEvent, params),
    bindNodeClick: (gEvent, double = false) => (params) =>
        __bindNodeClick(gEvent, {double, ...params}),
}

