import {GLife, GView} from "./I.contract";
import GEvent, {GStore} from "./O.g";
import Kt, {Abs, Dev, Ele} from "./I.common";
import Ld from '../library';
import GPos from "./O.graph.pos";
import {Graph} from "@antv/x6";
import GLayout from "./O.graph.layout";

class GGraph implements GLife, GView {
    private readonly _gEvent: GEvent = null;

    private _id: string = null;
    private _css: any = {};
    private _config: any = {};
    private _pos: GPos = null;

    private _layout: GLayout = null;            // 布局引用

    // g6 对应的方法
    private g6Graph: Graph = null;

    constructor(gEvent: GEvent) {
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
        const graphConfig = Abs.clone(this._config);

        // 涌入解析
        graphConfig.container = Ele.element(this._id);

        // 根据 pos 配置构造 Graph
        graphConfig.width = this._pos.width();
        graphConfig.height = this._pos.height();

        // 构造核心引用
        Dev.dgGraphic(graphConfig, "（主图）Graph 配置");
        this.g6Graph = new Graph(graphConfig);

        return this;
    }

    graph = (): Graph => this.g6Graph;
    container = () => Ele.element(this._id);
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

export default GGraph;