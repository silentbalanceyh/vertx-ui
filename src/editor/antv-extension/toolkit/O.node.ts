import {G} from "@antv/g6/types/g";
import global from "../../common/global";
import Cond from './I.condition';
import * as G6 from '@antv/g6';
import {NodeModel} from "../../common/interfaces";
import commandManager from "../../common/commandManager";
import {EditorCommand, GraphMode, ItemType} from "../../common/constants";
import {guid} from "../../utils";

const nodeAdd = (graph: G6.Graph, shape: G.Shape) => {
    if (Cond.isDrag(graph)) {
        let {x, y} = shape.getBBox();
        const model: NodeModel = global.component.itemPanel.model;
        // x += width / 2;
        // y += height / 2;

        shape.remove(true);
        graph.paint();

        commandManager.execute(graph, EditorCommand.Add, {
            type: ItemType.Node,
            model: {
                id: guid(),
                x,
                y,
                graph,      /* 补充：Model 中读取 graph */
                ...model
            }
        });

        graph.paint();
        global.component.itemPanel.model = null;

        graph.setMode(GraphMode.Default);
    }
};
export default {
    nodeAdd
}