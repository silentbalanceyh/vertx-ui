import Ux from "ux";

export default {
    rxEdgeInit: (edge, reference) => {
        const $inited = {};
        $inited.key = Ux.randomUUID();
        {
            const [upstream, downstream] = Ux.x6FromTo(edge, 'identifier');
            $inited.upstream = upstream;
            $inited.downstream = downstream;
            // 读取 upstreamName / downstreamName
            const up = Ux.elementUniqueDatum(reference,
                'resource.models', 'identifier', upstream);
            if (up) {
                $inited.upstreamName = up.alias;
            }
            const down = Ux.elementUniqueDatum(reference,
                'resource.models', 'identifier', downstream);
            if (down) {
                $inited.downstreamName = down.alias;
            }
            $inited.active = true;
            const source = edge.getSourceNode().getData();
            if (source) {
                // sigma / language 环境信息处理
                $inited.sigma = source.sigma;
                $inited.language = Ux.Env['LANGUAGE'];
            }
        }
        return $inited;
    },
    rxEdgeInitType: (reference) => (edge = []) => {
        const typeObj = Ux.elementUniqueDatum(reference, "relation.type", 'code', edge.type);
        if (typeObj) {
            edge.name = typeObj.name;
        }
        return edge;
    },
    rxNodeFilter: (reference) => (node, gEvent) => {
        const data = node.getData();
        if (data) {
            const itemKo = gEvent.nodeData("identifier");
            return !itemKo.has(data.identifier);
        } else return true;
    }
}