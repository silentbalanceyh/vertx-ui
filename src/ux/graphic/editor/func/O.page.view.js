import I from "./I.common";
import Cfg from "./O.config";
import g6Event from "../event/O.event";

const g6ViewConfig = (reference) => {

    /* 读取 _graphic */
    const graphic = I.g6Start(reference);

    /* 图形配置 */
    const $graphic = {};
    if (graphic.css) {
        /*
         * 图形配置处理
         */
        const {canvasHeight, ...rest} = graphic.css;
        $graphic.graphConfig = Cfg.g6ConfigViewer(reference, canvasHeight);
        $graphic.graph = rest;
        $graphic.nodeConfig = Cfg.g6ConfigNode(graphic.node, false);
    }
    return $graphic;
};
const g6ViewInit = (reference, onInit) => {
    const state = {};
    /* 图配置初始化 */
    state.$graphic = g6ViewConfig(reference);
    /* 窗口处理 */
    state.$inited = undefined;
    onInit(reference, state).then(processed => {
        reference.setState(processed);
        /* 维持一个实例，只在 DidMount 中执行，并且等最终成型后执行 */
        processed.$event = new g6Event(reference);
        processed.$ready = true;
        reference.setState(processed);
    })
};
export default {
    g6ViewInit
}