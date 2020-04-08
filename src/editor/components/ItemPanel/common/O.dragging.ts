import global from "../../../common/global";
import {GraphMode} from "../../../common/constants";
import Ex from '../../../antv-extension/toolkit';

const onStart = (reference: any) => {
    const {graph, model} = reference.props;
    global.component.itemPanel.model = model;
    graph.setMode(GraphMode.AddNode);
    /* 处于拖拽开始 */
    reference.setState({dragging: true});
};

const onMove = (reference: any, event: any) => Ex.shapeDrag(reference, (graph) => {
    /* 根据 Graph 来读取 */
    const point: any = graph.getPointByClient(event.clientX, event.clientY);
    let shape = Ex.shapeFind(graph);
    if (!shape) {
        /* 找不到，创建新的 Shape */
        shape = Ex.shapeAdd(graph, point);
    }
    /* 不论是否找到 */
    if (shape) {
        Ex.shapeUpdate(graph, shape, point);
    } else {
        console.error("失败！");
    }
});
const onEnd = (reference: any) => Ex.shapeDrag(reference, (graph) => {
    /* 根据 Graph 来读取 */
    let shape = Ex.shapeFind(graph);
    if (!shape) {
        throw new Error("变量 shape 在这种状态下必须存在！！");
    }
    /* 添加节点 */
    Ex.nodeAdd(graph, shape);
    /* 处理添加逻辑 */
    reference.setState({dragging: false});
});

export default {
    onStart,
    onMove,
    onEnd,
};// @-ts-ignore