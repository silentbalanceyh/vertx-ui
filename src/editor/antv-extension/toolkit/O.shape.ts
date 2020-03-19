import {G} from "@antv/g6/types/g";
import global from "../../common/global";
import * as G6 from '@antv/g6';
import {NodeModel} from "../../common/interfaces";
import * as isArray from "lodash/isArray";
import Cond from './I.condition';

const okSize = (model: any) => {
    let width;
    let height;
    const {size = 100} = model;
    if (isArray(size)) {
        width = size[0];
        height = size[1];
    } else {
        width = size as number;
        height = size as number;
    }
    return [width, height];
};
const shapeFind = (graph: G6.Graph): G.Shape => {
    if (Cond.isDrag(graph)) {
        const group: G.Group = graph.get('group');
        return group.findByClassName(global.component.itemPanel.delegateShapeClassName) as G.Shape;
    }
};

const shapeAdd = (graph: G6.Graph, point: any): G.Shape => {
    /* 全局传数据 */
    if (Cond.isDrag(graph)) {
        const model: NodeModel = global.component.itemPanel.model;
        /* 宽高计算 */
        const [width, height] = okSize(model);
        const x = point.x - width / 2;
        const y = point.y - height / 2;
        /* 组读取 */
        const group: G.Group = graph.get('group');
        const shape = group.addShape('rect', {
            className: global.component.itemPanel.delegateShapeClassName,
            attrs: {
                x,
                y,
                width,
                height,
                fill: '#f3f9ff',
                fillOpacity: 0.5,
                stroke: '#1890ff',
                strokeOpacity: 0.9,
                lineDash: [5, 5],
            },
        });
        graph.paint();
        return shape;
    }
};
const shapeUpdate = (graph: G6.Graph, shape: G.Shape, point: any) => {
    const {width, height} = shape.getBBox();
    const x = point.x - width / 2;
    const y = point.y - height / 2;
    /* 更新属性，重绘 */
    if (0 < x && 0 < y) {
        /* 防止最后松开鼠标过后的最后一次更新 */
        shape.attr({x, y});
        graph.paint();
    }
};
const shapeDrag = (reference: any, callback) => {
    const {dragging = false} = reference.state;
    const {graph} = reference.props;
    if (dragging && Cond.isDrag(graph)) {
        if (callback) {
            callback(graph);
        }
    }
};
export default {
    shapeFind,
    shapeAdd,
    shapeUpdate,
    shapeDrag,
}