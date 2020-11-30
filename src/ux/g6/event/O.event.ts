import Kt, {Eng} from './I.common';
import GGraph from "./O.graph";
import GNode from "./O.node";
import GAddOn from "./O.addon";
import GPos from "./O.graph.pos";

export class GStore {
    private readonly _stored: any = {};
    private readonly _ui: any = {};

    constructor(reference: any) {
        this._stored = Kt.inStore(reference);
        const {addon} = this._stored;
        if (addon) {
            const {window, stencil, toolbar} = addon;
            const ui: any = {};
            if (stencil) {
                ui.stencil = stencil;
            }
            if (toolbar) {
                ui.toolbar = toolbar;
            }
            if (window) {
                const windows = {};
                Object.keys(window).forEach(winKey => {
                    // Window解析
                    windows[winKey] = Eng.configDialog(reference, window[winKey]);
                });
                ui.window = window;
            } else {
                ui.window = {};
            }
            this._ui = ui;
        }
    }

    // 读取图配置
    inGraph = () => this._stored.graph ? this._stored.graph : {};
    inRegistry = () => this._stored.registry ? this._stored.registry : [];
    inNode = () => this._stored.node ? this._stored.node : {};
    // 读取 AddOn 配置
    inStencil = () => this._ui.stencil ? this._ui.stencil : {};
    inToolbar = () => this._ui.toolbar ? this._ui.toolbar : {};
    inWindow = (name: string) => this._ui.window[name] ? this._ui.window[name] : {};
}

// 子对象

class GEvent {
    private readonly reactRef = null;
    // 存储
    private readonly _stored: GStore = null;
    private readonly _node: GNode = null;

    // 数据信息
    private _graph: GGraph = null;
    private _addon: GAddOn = null;

    private constructor(reference: any) {
        this.reactRef = reference;

        /*
         * 先初始化 GStore，然后构造每部分内容
         *
         * 1. 图 Graph
         * 2. 节点 Node
         */
        const stored = new GStore(reference);
        const graph = new GGraph(this).configure(stored);
        this._node = new GNode(graph).configure(stored);
        this._addon = new GAddOn(graph).configure(stored);

        this._graph = graph;
        this._stored = stored;
    }

    static create(reference: any) {
        return new GEvent(reference);
    }

    initialize(): void {
        // 先初始化数据信息
        this._node.initialize(this);

        // 最后初始化图信息
        this._graph.initialize();

        // 先初始化插件
        this._addon.initialize(this._node);
    }

    // ---------------- 行为创建专用
    /*
     * 数据准备，构造 Node
     */
    dataNode(input: {}, isCenter: boolean = false) {
        const options = Kt.inOptions(this._stored);
        const normalized = Kt.onNode(input, options, this);

        // 默认注册器的值
        const registry = Kt.inRegistry(this._stored);
        if (registry) {
            normalized.shape = registry;
        }

        // 默认坐标设置，带有中心点
        if (isCenter) {
            const pos: GPos = this._graph.pos();
            const center = pos.center();
            Object.assign(normalized, center);
        }
        return normalized;
    }

    // ---------------- 核心数据结构提取
    /*
     * 直接返回 X6 中的图引用
     */
    g6Graph = () => this._graph.graph();

    /*
     * 直接返回 React 中的组件引用
     */
    reference = () => this.reactRef;

    /*
     * 返回所有ID集
     */
    id() {
        const id: any = {};
        id.graph = this._graph.id();
        // addOn
        const idAddOn: any = this._addon.id();
        if (idAddOn) Object.assign(id, idAddOn);
        return id;
    }

    /*
     * 返回所有Css的视图集
     */
    css() {
        const css: any = {};
        css.graph = this._graph.css();
        const cssAddOn: any = this._addon.css();
        if (cssAddOn) Object.assign(css, cssAddOn);
        return css;
    }
}

export default GEvent