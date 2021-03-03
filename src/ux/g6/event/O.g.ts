import Kt, {Eng} from './I.common';
import GGraph from "./O.graph";
import GNode from "./O.node";
import GAddOn from "./O.addon";
import GPos from "./O.graph.pos";
import GCommand from "./O.event.cmd";
import GInject from "./I.injections";

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
                const normalized = {};
                Object.keys(window).forEach(winKey => {
                    // Window解析
                    normalized[winKey] = Eng.configDialog(reference, window[winKey]);
                });
                ui.window = normalized;
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
    inWindow = () => this._ui.window ? this._ui.window : {};
}

/**
 * 图引擎专用对象
 *
 * @class GEvent
 */
class GEvent extends GInject {
    // ---------------- 核心数据结构提取
    private readonly reactRef = null;
    // 存储
    private readonly _stored: GStore = null;
    private readonly _node: GNode = null;
    private readonly _commands: GCommand = null;
    // 数据信息
    private _graph: GGraph = null;
    private _addon: GAddOn = null;

    private constructor(reference: any) {
        // @ts-ignore
        super(reference)
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

        // 命令绑定
        this._commands = new GCommand(this);

        this._graph = graph;
        this._stored = stored;
    }

    static create(reference: any) {
        return new GEvent(reference);
    }

    /*
     * 统一说明方法
     * - ui 前缀（提取配置专用）
     * --- uiToolbar：       工具栏配置读取
     * --- uiWindow：        弹出窗口配置读取
     *
     * - node/edge 前缀
     * 处理节点和边专用方法
     * --- nodeCreate：      创建节点
     * --- nodeOptions：     节点配置项
     * --- edgeCreate：      创建边线
     * --- configLayout：    布局设置
     *
     * - data 前缀
     * 数据信息读取
     * --- dataGraph:        图数据读取
     * --- dataNodes:        节点数据
     * --- dataEdges:        边线数据
     *
     * - g6 前缀
     * g6前缀专用的图内组件引用方法
     * --- g6Graph:          X6 中的 Graph 引用
     * --- g6Container:      X6 中的 container 对应的HTML元素引用
     *
     * - 通用方法
     * --- reference:        React 引用获取
     * --- id:               组件ID集构造
     * --- css:              风格数据构造
     */
    // ---------------- 配置处理
    uiToolbar = () => this._addon.uiToolbar();

    // ---------------- 窗口函数
    winOpen = ($inited: any = {}, state: any = {}) => {
        const stateOpen = this._addon.winOpenState($inited, state);
        this.reactRef.setState(stateOpen);
    };
    winClose = () => {
        const stateClose = this._addon.winCloseState();
        this.reactRef.setState(stateClose);
    };

    // ---------------- 行为创建专用
    initialize(): void {
        // 先初始化数据信息
        this._node.initialize(this);

        // 最后初始化图信息
        this._graph.initialize();

        // 图信息构造好过后，执行
        this._commands.initialize();

        // 先初始化插件
        this._addon.initialize(
            this._node,             // 可选数据节点
            this._commands          // 可执行的绑定函数
        );
    }

    /*
     * 数据准备，构造 Node
     */
    nodeCreate(input: {}, isCenter: boolean = false) {
        const options = Kt.inOptions(this._stored);
        const normalized = Kt.onNode(input, options, this);

        // 默认注册器的值
        const shape = Kt.inRegistry(this._stored);
        if (shape.node) {
            normalized.shape = shape.node;
        }

        // 默认坐标设置，带有中心点
        if (isCenter) {
            const pos: GPos = this._graph.pos();
            const center = pos.center();
            Object.assign(normalized, center);
        }
        return normalized;
    }

    nodeOptions = () => this._node.options();

    nodeData = (field: string) => {
        /*
         * 1）如果传入了 field，则以传入的 field 为主
         * 2）不传入则返回所有的节点数据
         */
        return Kt.dataNode(this._graph.graph(), field)
    }

    edgeCreate(input: {}) {
        const options = Kt.inOptions(this._stored);
        const normalized = Kt.onEdge(input, options, this);

        // 默认注册器的值
        const shape = Kt.inRegistry(this._stored);
        if (shape.edge) {
            normalized.shape = shape.edge;
        }
        return normalized;
    }

    // 布局初始化
    layoutOn = (data = {}, config) => this._graph.layoutOn(data, config);
    // 开启 resize 功能
    resizeOn = (removed = false) => {
        const pos = this._graph.pos();
        if (pos.resizeIs()) {
            if (removed) {
                // 移除
                window.removeEventListener("resize", () => {
                });
            } else {
                // 添加
                window.addEventListener('resize', () => Kt.posResize(pos, this._graph, this._addon));
            }
        }
    };
    // 侧边栏初始化
    stencilOn = () => this._addon.stencilOn(this.onNodeFilter);
    // 侧边栏重新加载
    stencilReload = (name: string) => this._addon.stencilReload(name, this.onNodeFilter);
    // ---------------- 引用信息

    /*
     * 直接返回 X6 中的图引用
     */
    g6Graph = () => this._graph.graph();
    g6Container = () => this._graph.container();
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