import Ux from 'ux';
import E from './O.elements';

const _g6Types = (reference, init = {}) => {
    const typeMap = {};
    const types = Ux.onDatum(reference, init.types);
    types.forEach(type => typeMap[type.code] = type.name);
    return typeMap;
};

const _g6Current = (nodes = [], metadata = {}) => {
    const {current = {}, data = [], config = {}} = metadata;
    if (config.center) {
        /*
         * 中心点设置，绑定 current 变量
         * x, y
         */
        if (0 === nodes.length) {
            /*
             * 追加当前数据，必须有一个
             */
            const currentOnly = data
                .filter(each => each.data.identifier === current.identifier);
            console.info(currentOnly);
            const normalized = E.g6ElementNodes(currentOnly, config);
            normalized.forEach(eachNorm => nodes.push(eachNorm));
        }
        nodes.forEach(node => {
            if (current.key === node.id) {
                Object.assign(node, config.center);
            }
        });
    }
};
const _g6Nodes = (relations = [], metadata = {}) => {
    const {current = {}, data = [], config = {}} = metadata;
    /* 计算包含的所有 identifier */
    const relatedSet = new Set();
    relatedSet.add(current.identifier);
    relations.forEach(each => {
        if (each.upstream) relatedSet.add(each.upstream);
        if (each.downstream) relatedSet.add(each.downstream);
    });

    /* 集合中所有的 identifier */
    const $identifiers = Ux.immutable(Array.from(relatedSet));

    /* 计算当前 */
    const filtered = data
        .filter(each => $identifiers.contains(each.data.identifier));
    const nodes = E.g6ElementNodes(filtered, config);
    /* 当前节点计算 */
    _g6Current(nodes, {config, data, current});

    return nodes;
};
const _g6Find = ($data = [], identifier) => {
    const found = Ux.elementFind($data, {identifier});
    if (1 === found.length) {
        return found[0];
    } else {
        const filter = found.filter(item => item.leaf); // 叶节点优先
        if (1 === filter.length) {
            return filter[0];
        }
    }
};
const _g6Edges = (relations = [], metadata = {}, types = {}) => {
    const {data = []} = metadata;
    const edges = [];
    /*
     * 遍历读取数据信息
     */
    const $data = Ux.clone(data);
    $data.forEach(each => each.identifier = each.data.identifier);

    relations.forEach(relation => {
        const upFound = _g6Find($data, relation.upstream);
        const downFound = _g6Find($data, relation.downstream);
        if (upFound && downFound) {

            /* Label计算 */
            const each = {};
            each.label = types[relation.type];
            each.source = upFound.key;
            each.target = downFound.key;
            edges.push(each);
        }
    });
    return edges;
};
/*
 * 数据
 * response:
 * {
 *     "identifier": "xxx",
 *     "graphic": {
 *     },
 *     "relations": [
 *     ]
 * }
 * metadata:
 * {
 *     "data": "节点元素",
 *     "config": "配置",
 *     "reference": "引用"
 * }
 */
const g6GraphicInit = (response = {}, metadata = {}) => {
    /*
     * 是否包含了原始的 graphic
     */
    if (response.graphic) {
        return response.graphic;
    } else {
        const {
            config = {},
            reference
        } = metadata;
        /*
         * 初始化数据提取
         */
        if (config.init) {
            const configInit = config.init;
            /* 类型映射 */
            const types = _g6Types(reference, configInit);

            /* 根据关系和 data中的节点计算节点信息 */
            let nodes = _g6Nodes(response['relations'], metadata);

            /* 根据关系和 data中的节点计算关系信息 */
            const edges = _g6Edges(response['relations'], metadata, types);

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
                const $id = Ux.immutable(Array.from(idSet));
                nodes = nodes.filter(item => $id.contains(item.id));
            }
            return {nodes, edges};
        } else {
            console.error("初始化配置出错，不可执行无图初始化！");
        }
    }
};
export default {
    g6GraphicInit
}