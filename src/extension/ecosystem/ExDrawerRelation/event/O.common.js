/*
 * 父子级不可创建关系
 * 1）计算结果为非法
 */
import Ux from "ux";
import Ex from "ex";
import Is from './O.common.is';

const edgeValidate = (reference, edge, graph) => {
    /*
 * 撤销处理和提交处理
 */
    const fnFailure = (key = "") => {
        Ux.sexMessage(reference, key, 2);
        const model = edge.getModel();
        Ex.g6ItemRemove(graph, model);
    };

    const source = Ex.g6EdgeData(edge);
    if (Is.isInherit(source)) {
        fnFailure("forbidden");
        return false;
    }
    if (Is.isNonCurrent(source, reference)) {
        fnFailure("direction");
        return false;
    }
    if (Is.isOnlyOne(source, graph)) {
        fnFailure("unique");
        return false;
    }
    return true;
};
const edgeInit = (edge) => {
    const $inited = {};
    /* 上游 */
    const source = edge.getSource();
    Ex.g6NodeData(source, data => {
        $inited.upstream = data.identifier;
        $inited.upstreamName = data.name;
    });
    /* 下游 */
    const target = edge.getTarget();
    Ex.g6NodeData(target, data => {
        $inited.downstream = data.identifier;
        $inited.downstreamName = data.name;
    });
    $inited.key = Ux.randomUUID();
    return $inited;
};
const anchorValidate = (source, reference, graph) => {
    return Is.isInherit(source)
        || Is.isNonCurrent(source, reference)
        || Is.isOnlyOne(source, graph);
};
export default {
    edgeValidate,
    edgeInit,
    anchorValidate,
}