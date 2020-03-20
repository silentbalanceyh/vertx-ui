const g6ItemRemove = (graph, model) => {
    if (graph) {
        const item = graph.findById(model.id);
        if (item) {
            graph.removeItem(item);
            graph.refresh();
        }
    } else {
        console.error("[引用不存在] graph 引用有问题", graph);
    }
};

const g6NodeData = (item, consumer) => {
    if (item) {
        const model = item.getModel();
        if (model && model.data) {
            if (consumer) {
                consumer(model.data);
            } else {
                return model.data;
            }
        }
    }
};

const g6EdgeData = (edge, consumer) => {
    const source = edge.getSource();
    const sourceData = g6NodeData(source);
    const target = edge.getTarget();
    const targetData = g6NodeData(target);
    if (sourceData && targetData) {
        if (consumer) {
            consumer(sourceData, targetData);
        } else {
            return {sourceData, targetData};
        }
    }
};

export default {
    g6ItemRemove,
    g6NodeData,
    g6EdgeData,
}