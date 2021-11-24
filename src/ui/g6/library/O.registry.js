// 演示用流程图
import pptEdge from './element-cell/ppt.edge';
import pptNode from './element-cell/ppt.node.js';
// 配置项绘图专用
import ciNode from './element-cell/ci.node.js';
import ciEdge from './element-cell/ci.edge.js';
// 配置项查看专用
import ciEdgeView from './element-cell/ci.edge.view';
import ciNodeView from './element-cell/ci.node.view';

export default {
    "edge-ppt": pptEdge,

    "node-ppt": pptNode,

    "node-ci": ciNode,

    "edge-ci": ciEdge,

    "edge-ci-view": ciEdgeView,
    "node-ci-view": ciNodeView,
}