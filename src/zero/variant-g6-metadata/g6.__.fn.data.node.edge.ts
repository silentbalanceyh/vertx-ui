export default {

    /*
     * 提交专用数据信息，得到图所有数据，结构
     * 1）node
     * 2）edge
     * 3）graphic
     * 构造的数据结果，重新构造数据
     * {
     *
     * }
     */
    data: (gEvent: any) => {
        const graph = gEvent.g6Graph();
        const nodes = graph.getNodes();
        const edges = graph.getEdges();
        const graphic = graph.toJSON();
        return {graphic, nodes, edges};
    },
    /*
     * 读取图上的节点信息
     */
    dataNode: (graph: any, field: string) => {
        const dataSet = new Set();
        graph.getNodes().map(node => node.getData())
            .filter(data => !!data)
            .forEach(data => {
                let value;
                if (field) {
                    value = data[field];
                } else {
                    value = data;
                }
                if (value) {
                    dataSet.add(value);
                }
            });
        return dataSet;
    },
}