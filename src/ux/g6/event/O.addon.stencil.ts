import GGraph from "./O.graph";
import {GLife, GView, ModeLayout} from "./I.contract";
import {GStore} from "./O.g";
import Ld from '../library';
import Kt, {Abs, Dev} from './I.common';
import GNode from "./O.node";
import {Addon, Graph} from "@antv/x6";
import GPos from "./O.graph.pos";

class GStencil implements GLife, GView {
    private readonly _gGraph: GGraph = null;

    private _id: string = null;
    private _config: any = {};
    private _registry: any = {};
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
            registry,                       // 注册节点名称
            criteria,                       // 搜索字段配置
            ...stencilConfig
        } = config;

        // CSS计算
        if (css) Object.assign(this._css, css);

        // ID计算
        this._id = container ? container : null;
        const options = Ld.g6DefaultAddOn(this._id, stencilConfig);
        {
            options.search = Kt.onNodeSearch(criteria);
            // FnAttr：设置 search 属性
        }
        this._config = options;
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
                    // 未配置侧边栏容器
                    // console.error("未找到侧边栏专用容器：", id);
                }
            } else {
                console.error("图初始化失败，g6Graph 引用为空！");
            }
        }
        return this;
    }

    initializeData(filterFn: Function = () => true) {
        const groupedData = this.getData();
        Object.keys(groupedData).forEach(group => {
            const nodes = groupedData[group].filter(filterFn);
            this._gStencil.load(nodes, group);
        })
    }

    reloadGroup(name: string, filterFn: Function = () => true) {
        const groupedData = this.getData();
        if (groupedData[name]) {
            const nodes = groupedData[name].filter(filterFn);
            this._gStencil.load(nodes, name);
        }
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

    private getData(): any {
        if (this._gStencil && this._gNode) {
            const {node} = this._registry;
            return this._gNode.groupNodes(node);
        } else {
            console.error("当前组件未初始化成功！！")
            return {};
        }
    }
}

export default GStencil;