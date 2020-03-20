import {guid} from '../../utils';
import global from '../../common/global';
import {EditorCommand, GraphMode, GraphType, ItemType} from '../../common/constants';
import {Behavior, GraphEvent, NodeModel} from '../../common/interfaces';
import {G} from '@antv/g6/types/g';
import commandManager from '../../common/commandManager';
import behaviorManager from '../../common/behaviorManager';
import * as isArray from "lodash/isArray";

interface DragAddNodeBehavior extends Behavior {

    handleCanvasMouseEnter(e: GraphEvent): void;

    handleMouseMove(e: GraphEvent): void;

    handleMouseUp(e: GraphEvent): void;
}

const dragAddNodeBehavior: DragAddNodeBehavior = {

    graphType: GraphType.Flow,

    graphMode: GraphMode.AddNode,

    getEvents() {
        return {
            'canvas:mouseenter': 'handleCanvasMouseEnter',
            mousemove: 'handleMouseMove',
            mouseup: 'handleMouseUp'
        };
    },

    handleCanvasMouseEnter(e) {
        /* 进入场景的时候的操作，可能会移除 */
        const {graph, shape} = this;
        if (shape) {
            return;
        }

        const group: G.Group = graph.get('group');
        /* 全局传数据 */
        const model: NodeModel = global.component.itemPanel.model;

        const {size = 100} = model;

        let width;
        let height;

        if (isArray(size)) {
            width = size[0];
            height = size[1];
        } else {
            width = size as number;
            height = size as number;
        }

        const x = e.x - width / 2;
        const y = e.y - height / 2;

        this.shape = group.addShape('rect', {
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
    },

    handleMouseMove(e) {
        const {graph} = this;
        const {width, height} = this.shape.getBBox();

        const x = e.x - width / 2;
        const y = e.y - height / 2;

        this.shape.attr({
            x,
            y,
        });

        graph.paint();
    },

    handleMouseUp(e) {
        const {graph} = this;
        const {width, height} = this.shape.getBBox();

        let x = e.x;
        let y = e.y;

        const model: NodeModel = global.component.itemPanel.model;

        if (model.center === 'topLeft') {
            x -= width / 2;
            y -= height / 2;
        }

        this.shape.remove(true);

        commandManager.execute(graph, EditorCommand.Add, {
            type: ItemType.Node,
            model: {
                id: guid(),
                x,
                y,
                ...model,
            },
        });
    },
};

behaviorManager.register('drag-add-node', dragAddNodeBehavior);
