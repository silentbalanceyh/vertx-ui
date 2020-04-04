import Ux from "ux";

const edgeLinkData = (link = {}, edgeData) => {
    if (edgeData) {
        const {sourceData = {}, targetData = {}} = edgeData;
        link.upstream = sourceData.identifier;
        link.upstreamName = sourceData.name;
        link.downstream = targetData.identifier;
        link.downstreamName = targetData.name;
    }
};

const edgeInit = (edge) => {
    const $inited = {};
    /* 上游 */
    const edgeData = Ux.g6GetEdge(edge);
    edgeLinkData($inited, edgeData);
    $inited.key = Ux.randomUUID();
    return $inited;
};
const edgeCreateEach = (model, identifier, up = true, graph = {}) => {
    const edgeData = {};
    /*
     * key （新的）
     * source / target
     */
    const {nodes = [], edges = []} = graph;
    const found = Ux.elementUnique(nodes, 'identifier', identifier);
    if (found) {
        /*
         * 找到目标 model
         */
        edgeData.key = Ux.randomUUID();
        if (up) {
            edgeData.source = found.key;
            edgeData.target = model.key;

            const data = {};
            data.key = edgeData.key;
            edgeLinkData(data, {sourceData: found, targetData: model});
            edgeData.data = data;
        } else {
            edgeData.target = found.key;
            edgeData.source = model.key;

            const data = {};
            data.key = edgeData.key;
            edgeLinkData(data, {sourceData: model, targetData: found});
            edgeData.data = data;
        }
        /* 计算 edges 中是否存在 */
        const counter = edges.filter((edge = {}) => {
            const {sourceData = {}, targetData = {}} = edge;
            return sourceData.key === edgeData.source
                && targetData.key === edgeData.target;
        }).length;
        if (0 === counter) {
            return edgeData;
        }
    }
};
const edgeCreate = (model, links = [], gEvent) => {
    /*
    * 根据关系查找和当前节点相关的点（自动绘图专用）
    * 关系节点 $autoLink 执行转换，根据 MRelation 执行强转换
    * {
    *     "current": "key",
    *     "from":[
    *         {key:id, type:label, data}
    *     ],
    *     "to":[
    *         {key:id, type:label, data}
    *     ],
    * }
    * 最终查找的结果为目标点相关信息
    * */
    const graph = gEvent.g6Nodes(model, true);
    /*
         * 读取点相关信息，直接处理 $autoLink 部分
         */
    const current = model.data;
    const edgeData = [];
    if (current) {
        /* 定义关系信息 */
        const typeMap = Ux.g6DataEdgeType(gEvent.reference());
        links.forEach(link => {
            /* 下游 */
            let created;
            if (current.identifier === link.upstream) {
                created = edgeCreateEach(current, link.downstream, false, graph);
            }
            /* 上游 */
            if (current.identifier === link.downstream) {
                created = edgeCreateEach(current, link.upstream, true, graph);
            }
            if (created) {
                /* 类型处理 */
                if (created.data) created.data.type = link.type;
                created.label = typeMap[link.type];
                edgeData.push(created);
            }
        });
    }
    return edgeData;
};
const onAfterConnect = (gEvent) => (node = {}) => {
    /* 验证通过 */
    const {edge} = node;
    if (edge) {
        /* 打开 */
        gEvent.rsShow(edgeInit(edge), edge.getModel());
    }
};
const onAfterAddItem = (gEvent) => (params = {}) => {
    const {item} = params;
    const type = item.getType();
    if ("node" === type) {
        const {$auto = false, $autoLink = []} = gEvent.reference().props;
        if ($auto) {
            /*
             * 仅在添加 nodes 时计算
             */
            const {model} = params;
            const edges = edgeCreate(model, $autoLink, gEvent);
            /*
             * 添加边信息
             */
            gEvent.g6AddEdges(edges);
        }
    }
};
export default {
    /* 连接完成后 */
    onAfterConnect,
    /* 自动绘图 */
    onAfterAddItem
}