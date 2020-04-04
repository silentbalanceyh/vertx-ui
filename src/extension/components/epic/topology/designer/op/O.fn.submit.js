import Ux from 'ux';
import Ex from 'ex';

export default (reference) => ({
    save: (data = {}, doSubmit) => {
        /*
        * 保存节点到核心模板中
        * G_GRAPHIC
        * G_NODE
        * G_EDGE
        * */
        const {$inited = {}} = reference.props;
        const {nodes = [], edges = []} = data;
        /*
         * 节点数据构造
         */
        const request = Ux.clone($inited);
        const nodeData = [];
        const nodeMap = {};
        nodes.forEach(node => {
            const modelData = node.getModel();
            const {graph, ...model} = modelData;
            /* record 信息 */
            const dataRef = model.data ? model.data : {};
            if (!Ux.isEmpty(dataRef)) {
                const nodeItem = {};
                /* 基本信息 */
                nodeItem.key = Ux.randomUUID();
                nodeItem.x = model.x;
                nodeItem.y = model.y;
                nodeItem.name = model.label;

                nodeItem.recordData = JSON.stringify(dataRef);
                nodeItem.recordKey = dataRef.key;
                /* Sigma 相关 */
                nodeItem.sigma = $inited.sigma;
                nodeItem.language = $inited.language;
                nodeItem.active = true;
                nodeItem.graphicId = $inited.key;
                nodeItem.ui = JSON.stringify(model);
                nodeData.push(nodeItem);
                /* 重建 key */
                nodeMap[model.id] = nodeItem.key;
            }
        });
        request.nodes = nodeData;
        /*
         * 边界数据信息
         */
        const edgeData = [];
        edges.forEach(edge => {
            const modelData = edge.getModel();
            const {graph, ...model} = modelData;

            const dataRef = model.data ? model.data : {};
            if (!Ux.isEmpty(dataRef)) {
                const edgeItem = {};
                /* 基本信息 */
                if (model.id) {
                    edgeItem.key = model.id;
                } else {
                    edgeItem.key = model.key;
                }

                edgeItem.sourceKey = nodeMap[model.source];
                edgeItem.targetKey = nodeMap[model.target];
                /* 名称 */
                edgeItem.name = `${model.source}->${model.target}`;
                edgeItem.graphicId = $inited.key;
                edgeItem.sigma = $inited.sigma;
                edgeItem.language = $inited.language;
                edgeItem.active = true;
                /* 记录 */
                edgeItem.recordData = JSON.stringify(dataRef);
                edgeItem.recordKey = dataRef.key;
                edgeItem.ui = JSON.stringify(model);
                edgeData.push(edgeItem);
            }
        });
        request.edges = edgeData;
        request.active = 0 < edgeData.length; // 边大于0则是合法
        /* 最终请求数据 */
        return Ux.ajaxPut('/api/graphic/:key', request)
            .then(response => Ux.sexDialog(reference, "submitted", () => {
                doSubmit();
                /* 关闭当前页 */
                Ex.rx(reference).close(response);
            }))
    }
})