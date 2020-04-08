import Abs from '../../../abyss';
import Eng from '../../../engine';

const CV_EDITOR = {
    NODE_SHAPE: 'exCiNode',
    LINE_SHAPE: 'exPolyline',
    SIZE: 80,
    SIZE_IMG: 42
};
const CV_VIEWER = {
    NODE_SHAPE: 'exBaseNode',
    LINE_SHAPE: 'exPolyline',
    SIZE: 80,
    SIZE_IMG: 42
};
const g6ConfigEditor = (reference, $height = 172) => {
    return {
        /* 禁用缩放功能，minZoom/maxZoom 全部设置成1 */
        minZoom: 1,
        maxZoom: 1,
        /* 高度设置 */
        height: Eng.toHeight($height),
        /* 开启动画 */
        animate: true,
        defaultNode: {
            shape: CV_EDITOR.NODE_SHAPE
        },
        defaultEdge: {
            shape: CV_EDITOR.LINE_SHAPE
        }
    }
};
const g6ConfigViewer = (reference, $height = 160) => {
    return {
        /* 高度设置 */
        height: Eng.toHeight($height),
        /* 开启动画 */
        animate: true,
        defaultNode: {
            shape: CV_VIEWER.NODE_SHAPE
        },
        defaultEdge: {
            shape: CV_VIEWER.LINE_SHAPE
        }
    }
};
const g6ConfigEditorNode = (config = {}) => {
    config = Abs.clone(config);
    Object.assign(config, {
        model: {
            shape: CV_EDITOR.NODE_SHAPE,
            size: CV_EDITOR.SIZE,
        },
        image: {
            width: CV_EDITOR.SIZE_IMG,
            height: CV_EDITOR.SIZE_IMG,
        }
    });
    return config;
};
const g6ConfigViewerNode = (config = {}) => {
    config = Abs.clone(config);
    Object.assign(config, {
        model: {
            shape: CV_VIEWER.NODE_SHAPE,
            size: CV_VIEWER.SIZE,
        },
        image: {
            width: CV_VIEWER.SIZE_IMG,
            height: CV_VIEWER.SIZE_IMG,
        }
    });
    return config;
};
export default {
    g6ConfigEditor,
    g6ConfigViewer,
    g6ConfigNode: (config = {}, editable = true) =>
        editable ? g6ConfigEditorNode(config) : g6ConfigViewerNode(config)
}