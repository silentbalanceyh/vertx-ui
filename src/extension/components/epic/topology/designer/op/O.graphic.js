import Ux from "ux";

const dataNode = (node, $inited = {}, storedMap = {}) => {

    /* 核心数据 */
    const nodeData = node.getData();
    if (nodeData) {
        const record = {};
        /* 基本信息 */
        record.key = Ux.randomUUID();
        record.name = node.getLabel();
        const position = node.getPosition();
        record.x = position.x;
        record.y = position.y;

        /* 关联记录 */
        record.recordData = JSON.stringify(nodeData);
        record.recordKey = nodeData.key;

        /* 系统相关 */
        record.sigma = $inited.sigma;
        record.language = $inited.language;
        record.active = true;
        record.graphicId = $inited.key;
        record.ui = JSON.stringify(node.toJSON());

        /* id => data key 的映射关系 */
        storedMap[node.id] = record.key;
        return record;
    }
}

const dataEdge = (edge, $inited = {}, storedMap = {}) => {
    /* 核心数据 */
    const edgeData = edge.getData();
    if (edgeData) {
        const record = {};
        /* 边相关处理 */
        record.key = Ux.randomUUID();
        // 读取 edge 相关信息
        const source = edge.getSourceNode();
        const target = edge.getTargetNode();
        record.sourceKey = storedMap[source.id];
        record.targetKey = storedMap[target.id];

        /* 基本信息 */
        record.name = `${source.id} -> ${target.id}`;
        record.sigma = $inited.sigma;
        record.language = $inited.language;
        record.active = true;
        record.graphicId = $inited.key;
        record.ui = JSON.stringify(edge.toJSON());

        /* 记录信息 */
        record.recordData = JSON.stringify(edgeData);
        record.recordKey = edgeData.key;
        return record;
    }
}

export default {
    /*
     * 提交数据走的替换模式
     * nodes / edges 直接删除重建
     */
    onSubmit: (thisRef) => (gRequest = {}, gEvent) => {
        /**
         * 保存节点到核心模板
         * 1）G_GRAPHIC
         * 2）G_NODE
         * 3）G_EDGE
         */
        const {$inited = {}} = thisRef.props;
        const reference = gEvent.reference();
        const graph = gEvent.g6Graph();
        if (Ux.x6IsFree(graph)) {
            Ux.sexMessage(reference, 'free', 2);
        } else {
            // 正式提交
            // reference.?etState({$submitting: true}); // 基础提交
            Ux.of(reference).submitting().handle(() => {
                const request = Ux.clone($inited);

                /*
                 * 节点数据构造
                 */
                const nodes = gRequest.nodes();
                const storedMap = {};
                request.nodes = nodes
                    .map(node => dataNode(node, $inited, storedMap))
                    .filter(item => !!item);

                /*
                 * 映射处理
                 */
                const edges = gRequest.edges();
                request.edges = edges
                    .map(edge => dataEdge(edge, $inited, storedMap))
                    .filter(item => !!item);
                request.active = (0 < request.nodes.length);
                request.ui = JSON.stringify(gRequest.graphicJ());
                /* 最终请求数据保存 */
                return Ux.ajaxPut(`/api/graphic/:key`, request).then(response => {
                    // 提交完成
                    Ux.sexDialog(thisRef, 'submitted',
                        () => Ux.of(reference).submitted().done()
                        // () => reference.?etState({$submitting: false})
                    )
                })
            })

        }
    },
    onGraphInit: (thisRef, current = {}) => (gEvent) => {
        /**
         * response 的数据结构
         * {
         *      "edges": [],
         *      "nodes": [],
         *      "ui": {}
         * }
         */

        if (gEvent) {
            const response = thisRef.props.$inited;
            const data = {};
            if (response.ui) {
                // 已存储过的图相关数据
                Object.assign(data, response.ui);
            } else {
                /**
                 * 特定初始化，在图管理中不存在的的一种情况，就是使用 nodes / edges 来构造图信息
                 * 1）图为直接构造，第一次构造则直接使用 current 来构图
                 * 2）当保存过后，则图的渲染直接走 response.ui 中的数据即可
                 */
                data.nodes = [gEvent.nodeCreate(current, true)];
                data.edges = [];
            }
            return Ux.promise(data);
        } else {
            console.error("GEvent 对象构造失败，Graphic管理！！");
            return Ux.promise({
                nodes: [],
                edges: []
            })
        }
    },
    /**
     * 限制条件
     * 1）不可创建重复关系，其他都可
     * 2）关系定义的处理
     */
    onEdgeConnectedBefore: (reference, managed = {}) => (edge = {}, gEvent) => {
        const graph = gEvent.g6Graph()
        const duplicated = Ux.x6IsDupEdge(edge, graph);
        if (duplicated) {
            Ux.sexMessage(reference, 'duplicated', 2)
            return false;
        }
        return true;
    }
}