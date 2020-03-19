// @ts-ignore
import {GraphMode} from "../../common/constants";
import * as G6 from '@antv/g6';
/*
 * 检查 mode，只有在非 default 时可拖拽
 */
const isDrag = (graph: G6.Graph) => graph.getCurrentMode() !== GraphMode.Default;

export default {
    isDrag,
};//@-ts-ignore