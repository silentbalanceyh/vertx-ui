import G6Editor from "@antv/g6-editor";

const FUNS = {
    createToolbar: container => new G6Editor.Toolbar({container}),
    createPage: container => {
        const height = initHeight();
        return new G6Editor.Flow({
            graph: {
                container,
                height
            },
            align: {
                grid: true
            }
        });
    },
    createDetailpanel: container => {
        // 调试专用，Detail面板有问题
        return new G6Editor.Detailpannel({container});
    },
    createContextmenu: container => {
        // 对比
        return new G6Editor.Contextmenu({container});
    },
    createItempanel: container => new G6Editor.Itempannel({container}),
    createMinimap: container => new G6Editor.Minimap({
        container,
        height: 120,
        width: 200
    })
};

const initHeight = () => window.innerHeight - 158;

const initComponent = (reference, functionName) => {
    const fun = reference.props[functionName];
    return fun ? fun : FUNS[functionName];
};

const mountComponent = (reference = {}, executor, container) => {
    const {editor} = reference.props;
    const fnExecute = executor();
    const item = fnExecute(container);
    editor.add(item);
};

export default {
    initComponent,
    initHeight,
    mountComponent
};