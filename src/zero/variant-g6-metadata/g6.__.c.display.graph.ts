import {GLife, GView} from "./g6.__.c.interface.contract";
import {GStore} from "./g6.__.c.pojo.g.store";
import Kt from './g6.__.fn.pos.locate.element';
import {Graph} from "@antv/x6";
import {GPos} from "./g6.__.c.unit.g.pos";
import {GLayout} from "./g6.__.c.display.layout";
import __Zn from './zero.uca.dependency';

const Ld = __Zn.G6_LIBRARY;

export class GGraph implements GLife, GView {
    private readonly _gEvent: any = null;

    private _id: string = null;
    private _css: any = {};
    private _config: any = {};
    private _pos: GPos = null;

    private _layout: GLayout = null;            // 布局引用

    // g6 对应的方法
    private g6Graph: Graph = null;

    constructor(gEvent: any) {
        this._gEvent = gEvent;
    }

    configure(store: GStore): GGraph {
        const config = store.inGraph();
        const {position, css, layout, ...graphConfig} = config;

        // ID计算，计算当前图对应的 container，HTML ID
        const reference = this._gEvent.reference();
        const {$container} = reference.props;
        if ($container) {
            // 多图专用配置
            graphConfig.container = $container;
        }
        this._id = graphConfig.container;

        // CSS计算，风格数据
        if (css) Object.assign(this._css, css);

        // 构造图配置
        this._config = Ld.g6DefaultGraph(this._id, graphConfig);

        // 位置数据
        const pos = new GPos(position);

        // 布局构造
        this._layout = new GLayout(layout);

        // 带有工具栏的计算，工具栏本身不计算
        const toolbarCfg = store.inToolbar();
        if (toolbarCfg.container) {
            Kt.posCompressH(pos, toolbarCfg);
        }
        this._pos = pos;
        return this;
    }

    initialize(): GGraph {
        // 读取图配置
        const graphConfig = __Zn.clone(this._config);

        // 涌入解析
        graphConfig.container = __Zn.element(this._id);

        // 根据 pos 配置构造 Graph
        graphConfig.width = this._pos.width();
        graphConfig.height = this._pos.height();

        // 构造核心引用
        __Zn.dgGraphic(graphConfig, "（主图）Graph 配置");
        this.g6Graph = new Graph(graphConfig);

        return this;
    }

    graph = (): Graph => this.g6Graph;
    container = () => __Zn.element(this._id);
    reference = () => this._gEvent.reference();

    id = (): string => this._id;
    css = (): any => this._css;

    // GPos引用处理
    pos = (): GPos => this._pos;

    layoutOn = (data, config = {}) => {
        const layoutRef = this._layout.instance(this._pos, config);
        if (layoutRef) {
            layoutRef.layout(data);
        }
    }
}