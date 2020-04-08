import E from './O.data.item';
import Ele from '../../../element';
import Abs from '../../../abyss';
import Eng from '../../../engine';
import Dev from '../../../develop';
/*
 * 计算类型映射
 */
const _g6TypeMap = (data = []) => {
    const typeMap = {};
    data.forEach(type => typeMap[type.code] = type.name);
    return typeMap;
};

const _g6Find = ($data = [], identifier) => {
    const found = Ele.elementFind($data, {identifier});
    if (1 === found.length) {
        return found[0];
    } else {
        const filter = found.filter(item => item.leaf); // 叶节点优先
        if (1 === filter.length) {
            return filter[0];
        }
    }
};
const _g6Edges = (input = {}, graphic = {}, typeMap = {}) => {
    const $edges = [];
    /*
     * 遍历读取数据信息
     */
    const {nodes = [], edges = []} = input;
    const $data = Abs.clone(nodes);
    $data.forEach(each => each.identifier = each.data.identifier);
    /*
     * 当前节点不能包含自引用，过滤掉 upstream 和 downstream 相同的情况
     */
    edges.filter(item => item.upstream !== item.downstream).forEach(relation => {
        const upFound = _g6Find($data, relation.upstream);
        const downFound = _g6Find($data, relation.downstream);
        if (upFound && downFound) {

            /* Label计算 */
            const each = {};
            each.id = relation.key;    // 给边加上 key
            each.label = typeMap[relation.type];
            each.source = upFound.key;
            each.target = downFound.key;
            $edges.push(each);
        }
    });
    return $edges;
};
/*
 * 1. 这里的 relations 是原生结构
 * relation主要包含
 * {
 *     upstream: "上游节点",
 *     type: "类型",
 *     downstream: "下游节点"
 * }
 */
const _g6Nodes = (input = {}, graphic = {}) => {
    const {current = {}, nodes = [], edges = []} = input;
    /* 计算包含的所有 identifier */
    const relatedSet = new Set();
    relatedSet.add(current.identifier);
    edges.forEach(each => {
        if (each.upstream) relatedSet.add(each.upstream);
        if (each.downstream) relatedSet.add(each.downstream);
    });
    const $identifiers = Abs.immutable(Array.from(relatedSet));
    /*
     * 提取 nodeConfig
     */
    const {nodeConfig = {}} = graphic;
    /* 计算当前 */
    const filtered = nodes
        .filter(each => $identifiers.contains(each.data.identifier));

    return E.g6DataNodes(filtered, nodeConfig);
};
const _g6GetGraphic = (input = {}, graphic = {}) => {
    /*
     * 是否包含了原始的 graphic
     */
    if (input.graphic) {
        /*
         * 直接包含了 graphic
         */
        Dev.dgGraphic(input.graphic, "从存储中直接回复原始拓扑图", "#9400D3");
        return input.graphic;
    } else {
        const {
            source = {}
        } = graphic;
        if (source.data) {
            /* 类型映射 */
            const {types = []} = source.data;
            const typeMap = _g6TypeMap(types);

            /* 根据关系和 data中的节点计算节点信息 */
            let nodes = _g6Nodes(input, graphic);
            const edges = _g6Edges(input, graphic, typeMap);
            if (0 < edges.length) {
                /*
                * nodes / edges 生成图相关信息，有关系就过滤
                * 1) 关系存在时证明中间 current 点一定存在
                * 2) 如果关系为 0 证明 nodes 是唯一的数据非空图
                * */
                const idSet = new Set();
                edges.forEach(edge => {
                    idSet.add(edge.source);
                    idSet.add(edge.target);
                });
                const $id = Abs.immutable(Array.from(idSet));
                nodes = nodes.filter(item => $id.contains(item.id));
            }
            const data = {nodes, edges};
            /* 保证绝对安全的数据处理 */
            if (!Abs.isArray(data.nodes)) data.nodes = [];
            if (!Abs.isArray(data.edges)) data.edges = [];
            return data;
        } else {
            console.error("构造图的配置出错！必须包含 source.data 数据！");
        }
    }
};

/*
 * 数据
 * response:
 * {
 *     "identifier": "xxx",
 *     "graphic": {
 *          "...图节点",
 *          "nodes":[],
 *          "edges":[]
 *     },
 *     "relations": [
 *     ]
 * }
 * graphic:
 * {
 *     "...标准图配置"
 * }
 */
function g6GetGraphic() {
    if (2 === arguments.length) {
        return _g6GetGraphic(arguments[0], arguments[1]);
    } else if (4 === arguments.length) {
        const items = arguments[0];
        const edges = arguments[1];
        const current = arguments[2];
        const $graphic = arguments[3];
        if ($graphic) {
            const state = {};
            const $items = E.g6DataItems(items, $graphic.nodeConfig);
            state.$items = $items;
            const input = {
                nodes: $items.map(item => item.data),   // 节点 原始数据
                edges,                                  // 关系 原始数据
                graphic: current ? current.graphic : null,               // 原始图
                current,                                // 当前节点 原始数据
            };
            const graphic = g6GetGraphic(input, $graphic);
            const {nodes = []} = graphic;
            if (current) {
                /*
                 * 当前节点处理（记得替换处理过后的节点信息）
                 */
                if (current) {
                    g6DataCurrent({
                        current,
                        nodes,
                    }, $graphic);
                }
            }
            const $dropped = [];
            nodes.forEach(dataItem => $dropped.push(dataItem.data.identifier));
            state.$dropped = $dropped;
            state.$data = graphic;
            return state;
        } else {
            throw new Error("参数传入错误！");
        }
    } else {
        throw new Error("参数传入错误")
    }
};
/*
 * 副作用方法修改 nodes 引用
 */
const g6DataCurrent = (input = {}, graphic = {}) => {
    const {current = {}, nodes = []} = input;
    const {graph = {}, nodeConfig = {}} = graphic;
    if (graph.center) {
        /*
         * 中心点设置，绑定 current 变量
         * x, y
         */
        if (0 === nodes.length) {
            /*
             * 追加当前数据，必须有一个
             */
            const currentOnly = nodes
                .filter(each => each.data.identifier === current.identifier);
            const normalized = E.g6DataNodes(currentOnly, nodeConfig);
            normalized.forEach(eachNorm => nodes.push(eachNorm));
        }
        nodes.forEach(node => {
            if (current.key === node.id) {
                Object.assign(node, graph.center);
            }
        });
    }
};
export default {
    g6GetGraphic,
    g6DataCurrent,
    g6DataEdgeType: (reference) => {
        if (Abs.isArray(reference)) {
            return _g6TypeMap(reference);
        } else {
            const data = Eng.onDatum(reference, "relation.type");
            return _g6TypeMap(data);
        }
    }
}