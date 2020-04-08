import G from './O.graphic';

import Cfg from './O.config';
import Abs from '../../../abyss';

const g6GetNode = (item, consumer) => {
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

const g6GetEdge = (edge, consumer) => {
    const source = edge.getSource();
    const sourceData = g6GetNode(source);
    const target = edge.getTarget();
    const targetData = g6GetNode(target);
    if (sourceData && targetData) {
        if (consumer) {
            consumer(sourceData, targetData);
        } else {
            return {sourceData, targetData};
        }
    }
};
const g6GetNodeDef = (node = {}) => {
    const nodeConfig = Cfg.g6ConfigNode({});
    const data = {};
    data.id = node.key;
    if (node.name) {
        data.label = node.name;
    } else {
        data.label = node.text;
    }
    data.icon = g6UiImage(node);
    Object.assign(data, nodeConfig);
    data.data = Abs.clone(node);
    return data;
};
const g6GetEdgeDef = (edge = {}, metadata = {}) => {
    const {idMap, reference} = metadata;
    const typeMap = G.g6DataEdgeType(reference);
    const data = {};
    if (idMap) {
        data.source = idMap[edge.upstream];
        data.target = idMap[edge.downstream];
    } else {
        data.source = edge.upstream;
        data.target = edge.downstream;
    }
    if (typeMap) {
        data.label = typeMap[edge.type];
    }
    data.id = edge.key;
    return data;
};
const g6UiImage = (item = {}) => {
    let image;
    const {metadata} = item;
    if (metadata && metadata.image) {
        image = metadata.image;
    } else {
        image = '/img/ox/ci/' + item.identifier + ".png";
    }
    return image;
};
export default {
    g6GetNode,
    g6GetNodeDef,
    g6GetEdgeDef,
    g6GetEdge,
    g6UiImage,
}