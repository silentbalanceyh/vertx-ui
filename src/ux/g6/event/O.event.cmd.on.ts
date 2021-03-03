import GEvent from "./O.g";
import Ld from '../library';
import {Abs, T} from '../internal'
import {OptionKey} from "./I.contract";
import {Modal} from "antd";
// --------------------- 核心逻辑

const _onClickRemove = (gEvent, cell) => () => {
    const options = gEvent.nodeOptions();
    const config = options[OptionKey.MESSAGE_CONFIRM];
    const {node, edge, ...rest} = config;
    const content = cell.isNode() ? node : edge;
    // 隐藏语法部分的问题
    // @ts-ignore
    Modal.confirm({
        ...rest,
        content,
        onOk: () => {
            const graph = gEvent.g6Graph();
            graph.removeCell(cell.id);
        }
    })
}
const _edgeTool = (gEvent, cell) => {
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
            onClick: _onClickRemove(gEvent, cell)
        }
    }])
}
const _nodeTool = (gEvent, cell) => {
    cell.addTools([{
        name: 'button-remove',
        args: {
            ...Ld.V.CI_BUTTON_NODE,
            onClick: _onClickRemove(gEvent, cell)
        }
    }])
}
const _nodeReload = (gEvent, cell) => {
    const data = cell.getData();
    if (data) {
        const {__group} = data;
        if (__group) {
            const groupName = T.encryptMD5(__group);
            gEvent.stencilReload(groupName);
        }
    }
}
// --------------------- 核心函数
const portShow = (gEvent: GEvent, params: any = {}) => {
    const {show = true} = params;
    const container = gEvent.g6Container() as any;
    // 读取所有的 Port 对象
    let ports = container.querySelectorAll('.x6-port-body');
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden';
    }
}
const toolRemove = (gEvent: GEvent, {cell}) => cell.removeTools();

const connected = (gEvent: GEvent, params) => {
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
const combineFn = (arrayFun = []) => (gEvent, params) =>
    arrayFun.filter(each => Abs.isFunction(each)).forEach(executor => {
        executor(gEvent, params);
    })
const nodeAddon = (gEvent, params) => {
    const {cell} = params;
    if (cell.isNode()) {
        // AOP：限制节点删除
        const okRemove = gEvent.onNodeRemovable(cell);
        if (okRemove) {
            _nodeTool(gEvent, cell);
        }
    }
}
const edgeAddon = (gEvent, params) => {
    const {cell} = params;
    if (cell.isEdge()) {
        // AOP：限制边删除
        const okRemove = gEvent.onEdgeRemovable(cell);
        if (okRemove) {
            _edgeTool(gEvent, cell);
        }
    }
}

const nodeAdd = (gEvent, params) => {
    const {cell} = params;
    if (cell.isNode()) {
        _nodeReload(gEvent, cell);
    }
}
const nodeRemove = (gEvent, params) => {
    const {cell} = params;
    if (cell.isNode()) {
        _nodeReload(gEvent, cell);
    }
}
const nodeClick = (gEvent, params) => {
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
    combineFn,

    /**
     * 添加边相关按钮，在边上增加工具
     * 1）起点
     * 2）终点
     * 3）删除按钮
     */
    edgeAddonFn: (gEvent) =>
        (params) => edgeAddon(gEvent, params),

    /**
     * 添加节点相关按钮，在节点上增加工具
     * 1）删除按钮
     */
    nodeAddonFn: (gEvent) =>
        (params) => nodeAddon(gEvent, params),

    /**
     * 显示和隐藏连接桩的隐藏和显示
     */
    portShowFn: (gEvent, show = true) =>
        (params) => portShow(gEvent, {show, ...params}),

    /**
     * 连接专用处理
     */
    connectedFn: (gEvent) =>
        (params) => connected(gEvent, params),

    /**
     * 移除工具专用
     */
    toolRemoveFn: (gEvent) =>
        (params) => toolRemove(gEvent, params),
    /*
     * 节点专用
     */
    nodeAddFn: (gEvent) =>
        (params) => nodeAdd(gEvent, params),
    nodeRemoveFn: (gEvent) =>
        (params) => nodeRemove(gEvent, params),
    nodeClickFn: (gEvent, double = false) =>
        (params) => nodeClick(gEvent, {double, ...params}),
}

