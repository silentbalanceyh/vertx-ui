// 演示用流程图
import pptEdge from './registry.editor.ppt.edge';
import pptNode from './registry.editor.ppt.node';
// 配置项绘图专用
import ciNode from './registry.editor.ci.node';
import ciEdge from './registry.editor.ci.edge';
// 配置项查看专用
import ciEdgeView from './registry.viewer.ci.node';
import ciNodeView from './registry.viewer.ci.edge';

export default {
    "edge-ppt": pptEdge,

    "node-ppt": pptNode,

    "node-ci": ciNode,

    "edge-ci": ciEdge,

    "edge-ci-view": ciEdgeView,
    "node-ci-view": ciNodeView,
}