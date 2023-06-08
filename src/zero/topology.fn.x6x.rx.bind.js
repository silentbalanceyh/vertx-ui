import __Zn from './zero.module.dependency';
import __X6 from './topology.fn.x6.action';

/**
 * ## 「标准」`Ux.x6xEdgeInit`
 *
 * @memberOf module:x6/zero
 * @param edge
 * @param reference
 * @returns {*}
 */
const x6xEdgeInit = (edge, reference) => {
    const $inited = {};
    $inited.key = __Zn.randomUUID();
    {
        const [upstream, downstream] = __X6.x6FromTo(edge, 'identifier');
        $inited.upstream = upstream;
        $inited.downstream = downstream;
        // 读取 upstreamName / downstreamName
        const up = __Zn.elementUniqueDatum(reference,
            'resource.models', 'identifier', upstream);
        if (up) {
            $inited.upstreamName = up.alias;
        }
        const down = __Zn.elementUniqueDatum(reference,
            'resource.models', 'identifier', downstream);
        if (down) {
            $inited.downstreamName = down.alias;
        }
        $inited.active = true;
        const source = edge.getSourceNode().getData();
        if (source) {
            // sigma / language 环境信息处理
            $inited.sigma = source.sigma;
            $inited.language = __Zn.Env['LANGUAGE'];
        }
    }
    return $inited;
};
/**
 * ## 「标准」`Ux.x6xEdgeInitType`
 * @memberOf module:x6/zero
 * @param reference
 * @returns {*}
 */
const x6xEdgeInitType = (reference) => (edge = []) => {
    const typeObj = __Zn.elementUniqueDatum(reference, "relation.type", 'code', edge.type);
    if (typeObj) {
        edge.name = typeObj.name;
    }
    return edge;
};
/**
 * ## 「标准」`Ux.x6xNodeFilter`
 * @memberOf module:x6/zero
 * @param reference
 * @returns {*}
 */
const x6xNodeFilter = (reference) => (node, gEvent) => {
    const data = node.getData();
    if (data) {
        const itemKo = gEvent.nodeData("identifier");
        return !itemKo.has(data.identifier);
    } else return true;
}
export default {
    x6xEdgeInit,
    x6xEdgeInitType,
    x6xNodeFilter,
}