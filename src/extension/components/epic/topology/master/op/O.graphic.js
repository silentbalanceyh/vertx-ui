import Ux from "ux";

export default {
    onEdgeConnectedBefore: (reference, managed = {}) => (edge = {}, gEvent) => {
        const graph = gEvent.g6Graph();
        const duplicated = Ux.x6IsDupEdge(edge, graph);
        if (duplicated) {
            Ux.sexMessage(reference, 'duplicated', 2)
            return false;
        }
        return true;
    },
    onSubmit: (reference) => (gRequest, gEvent) => {
        // TODO: 保存主图接口调用
    },
    onGraphInit: (reference) => (gEvent) => {
        const {
            $data = {},
            $initialize = false,
        } = reference.state;
        const data = {};
        if ($initialize) {
            data.nodes = [];
            data.edges = [];
            const {nodes = [], edges = []} = $data;
            const nodeSet = new Set();
            edges.map(edge => {
                if (edge.upstream) nodeSet.add(edge.upstream);
                if (edge.downstream) nodeSet.add(edge.downstream);
                return edge;
            }).map(edge => gEvent.edgeCreate(edge)).forEach(edge => data.edges.push(edge));
            /*
             * 节点计算，祛除散点
             */
            nodes.filter(node => nodeSet.has(node.identifier))
                .map(node => gEvent.nodeCreate(node)).forEach(node => data.nodes.push(node));
            /* 创建新内容需要的布局计算 */
            gEvent.layoutOn(data, {});
        } else {
            /* 构造数据集 */
            Object.assign(data, $data);
        }
        return Ux.promise(data);
    }
}
