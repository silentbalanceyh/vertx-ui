import graphic from './O.graphic';
import Ex from "ex";
import Ux from 'ux';

/**
 * 创建新数据
 */
const yiNew = (reference) => Ex.I.relation().then(edges => {
    /* 基本的 Items */
    const items = Ux.g6DataTree(reference);
    /* 节点数据 */
    const nodes = items.map(item => item.data);
    /* 初始化状态 */
    const state = {};
    state.$data = {
        nodes,
        edges,
    }
    state.$initialize = true;       // 新图（系统自动初始化）
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
    /* 消息显示 */
    Ux.sexMessage(reference, 'temp', 4.8);
})
const yiExist = (reference, graphic = {}) => {
    const state = {};
    state.$data = graphic;
    state.$initialize = false;      // 不需要初始化
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}
export default {
    yiGraphic: (reference) => {
        Ux.ajaxGet(`/api/graphic/definition/master`).then(response => {
            const graphicRef = response['graphic'];
            if (graphicRef) {
                yiExist(reference, graphicRef);
            } else {
                yiNew(reference);
            }
        })
    },
    rxCommand: (reference) => {
        const gxFun = {};
        gxFun.onNodeInitBefore = Ux.g6Image();
        gxFun.onEdgeInitBefore = Ex.X6.rxEdgeInitType(reference);
        gxFun.onEdgeConnectedBefore = graphic.onEdgeConnectedBefore(reference, {});
        gxFun.onSubmit = graphic.onSubmit(reference);
        gxFun.rxGraphInit = graphic.onGraphInit(reference);
        gxFun.rxEdgeInit = Ex.X6.rxEdgeInit;
        return gxFun;
    }
}