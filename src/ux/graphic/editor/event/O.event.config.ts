import Abs from "../../../abyss";
import Eng from '../../../engine';

const toParsed = (cmd: any) => {
    const cmdArr = cmd.split(',');
    const cmdItem: any = {};
    if (cmdArr[0]) cmdItem.icon = cmdArr[0];
    if (cmdArr[1]) cmdItem.text = cmdArr[1];
    if (cmdArr[2]) cmdItem.command = cmdArr[2];
    if (!cmdItem.command) {
        cmdItem.command = cmdItem.icon;
    }
    return cmdItem;
};

const toContextItem = (item: any = {}) => {
    const node: any = {};
    if (Abs.isObject(item)) {
        Object.assign(node, item);
    } else {
        const cmdItem: any = toParsed(item);
        Object.assign(node, cmdItem);
    }
    return node;
};

class GEventConfig {
    private readonly graphicRef = null;

    constructor(graphic: any) {
        this.graphicRef = graphic;
    }

    graphic() {
        return this.graphicRef;
    }

    configGraphic(addOn: any = {}) {
        let {graphConfig = {}} = this.graphicRef;
        graphConfig = Abs.clone(graphConfig);
        Object.assign(graphConfig, addOn);
        return {graphConfig};
    }

    configEditor() {
        const {graph = {}} = this.graphicRef;
        const editor: any = {};
        if (graph.className) {
            editor.className = `web-editor ${graph.className}`;
        } else {
            editor.className = `web-editor`;
        }
        return editor;
    }

    configContext() {
        const {context} = this.graphicRef;
        const menus: any = {};
        if (context) {
            /* 节点执行 */
            const nodes = [];
            context.onNode.map(edge => toContextItem(edge))
                .forEach(node => nodes.push(node));
            menus.nodes = nodes;

            /* 边执行专用 */
            const edges = [];
            context.onEdge.map(edge => toContextItem(edge))
                .forEach(node => edges.push(node));
            menus.edges = edges;
        }
        return menus;
    }

    configItems() {
        const {graph = {}} = this.graphicRef;
        const pad: any = {};
        pad.className = "box";
        if (graph.maxHeight) {
            pad.style = {maxHeight: Eng.toHeight(graph.maxHeight)};
        } else {
            /* 默认配置 */
            pad.style = {maxHeight: 600};
        }
        return pad;
    }

    configWindow() {
        const {window = {}} = this.graphicRef;
        return window;
    }

    configCommands() {
        const {command = []} = this.graphicRef;
        const commands = [];
        if (Abs.isArray(command)) {
            command.forEach(cmd => {
                if (Abs.isObject(cmd)) {
                    commands.push(cmd);
                } else if ("string" === typeof cmd) {
                    if ("|" === cmd) {
                        commands.push(cmd);
                    } else {
                        const cmdItem: any = toParsed(cmd);
                        commands.push(cmdItem);
                    }
                }
            })
        }
        return commands;
    }

    dataSource(key) {
        const {source} = this.graphicRef;
        if (source && source.data) {
            return source.data[key];
        }
    }
}

export default GEventConfig