import GGraph from "./O.graph";
import {GLife, GView, ModeItem, ModeLayout} from "./I.contract";
import {GStore} from "./O.event";
import Ld from '../library';
import Kt, {Abs, Dev} from './I.common';
import GNode from "./O.node";
import {Addon, Graph} from "@antv/x6";
import GPos from "./O.graph.pos";

class GStencil implements GLife, GView {
    private readonly _gGraph: GGraph = null;

    private _mode: ModeItem = ModeItem.Standard;
    private _id: string = null;
    private _config: any = {};
    private _registry: string;
    private _css: any = {};
    // UI组件
    private _gStencil: Addon.Stencil = null;
    private _gNode: GNode = null;

    constructor(gGraph: GGraph) {
        this._gGraph = gGraph;
    }

    configure(store: GStore): GStencil {
        // 读取配置信息
        const config = store.inStencil();
        const {
            container,                      // 容器
            css,                            // CSS风格
            mode = ModeItem.Standard,       // 选择模式
            registry,                       // 注册节点名称
            ...stencilConfig
        } = config;

        // CSS计算
        if (css) Object.assign(this._css, css);

        // Mode 选择构造
        this._mode = mode;

        // ID计算
        this._id = container ? container : null;
        this._config = Ld.g6DefaultAddOn(this._id, stencilConfig);

        // 注册节点名称
        this._registry = registry;

        return this;
    }

    bind(gNode: GNode): GStencil {
        this._gNode = gNode;
        return this;
    }

    initialize(): GStencil {
        if (this._gNode) {
            // 根据 GPos 计算
            const posRef = this._gGraph.pos();
            const cssCombine: any = Abs.clone(this._css);

            // 如果不包含 height 属性才执行
            if (!cssCombine.hasOwnProperty('height')) {
                // 布局模式计算
                const layout: ModeLayout = posRef.mode();

                // 计算高度
                let calculated = posRef.height();
                if (ModeLayout.LeftRight === layout) {
                    calculated += posRef.adjust().y;
                }
                // 计算过后的高度修改
                this._css.height = calculated;
            }

            // 初始化 Stencil
            const g6Graph: Graph = this._gGraph.graph();
            if (g6Graph) {
                const stencil = Abs.clone(this._config);
                stencil.target = g6Graph;
                stencil.groups = this._gNode.groupConfig();
                Dev.dgGraphic(stencil, "（插件）Addon - stencil 配置");

                // 处理容器
                const id = this._id;
                const container = document.querySelector(`#${id}`);
                if (container) {
                    const stencilUi = new Addon.Stencil(stencil);
                    container?.appendChild(stencilUi.container);
                    // 构造
                    this._gStencil = stencilUi;
                } else {
                    console.error("未找到侧边栏专用容器：", id);
                }
            } else {
                console.error("图初始化失败，g6Graph 引用为空！");
            }
        }
        return this;
    }

    initializeData(): GStencil {
        if (this._gStencil && this._gNode) {
            const groupNodes = this._gNode.groupNodes(this._registry);
            if (groupNodes) {
                Object.keys(groupNodes).forEach(name => {
                    const items = groupNodes[name];
                    // 加载数据
                    this._gStencil.load(items, name);
                });
            }
        } else {
            console.error("当前组件未初始化成功！！")
        }
        return this;
    }

    id = (): string => this._id;
    css = (): any => {
        const css: any = this._css;
        const pos: GPos = this._gGraph.pos();
        if (!css.hasOwnProperty('height')) {
            css.height = Kt.posStencil(pos);
        }
        return css;
    };
}

export default GStencil;