import Ux from "ux";
import Ex from "ex";
import graphic from "./O.graphic";

export default {
    yiGraphic: (reference) => {
        const state = {};
        // 计算当前节点，将数据转换成模型
        const {$inited = {}} = reference.props;
        const items = Ux.g6DataTree(reference);

        // 读取当前节点信息
        state.$current = Ux.elementUnique(items.map(item => item.data),
            "identifier", $inited.modelId);

        Ex.I.relation().then(relations => {
            state.$relations = relations;
            Ux.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        });
    },
    rxCommand: (reference) => {
        const gxFun = {};

        const {$current = {}} = reference.state;
        gxFun.onNodeInitBefore = Ux.g6Image();
        gxFun.onEdgeInitBefore = Ex.X6.rxEdgeInitType(reference);
        gxFun.onEdgeConnectedBefore = graphic.onEdgeConnectedBefore(reference, $current);
        gxFun.onSubmit = graphic.onSubmit(reference, $current);
        gxFun.rxGraphInit = graphic.onGraphInit(reference, $current);
        gxFun.rxEdgeInit = Ex.X6.rxEdgeInit;
        return gxFun;
    }
}