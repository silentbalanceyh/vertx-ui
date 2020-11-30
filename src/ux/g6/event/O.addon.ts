import {GLife, GView} from "./I.contract";
import GGraph from "./O.graph";
import {GStore} from "./O.event";
import GToolbar from "./O.addon.toolbar";
import GStencil from "./O.addon.stencil";
import GNode from "./O.node";

class GAddOn implements GLife, GView {

    private readonly _gGraph: GGraph = null;

    private readonly _uiToolbar: GToolbar = null;
    private readonly _uiStencil: GStencil = null;

    constructor(gGraph: GGraph) {
        this._gGraph = gGraph;
        this._uiToolbar = new GToolbar(gGraph);
        this._uiStencil = new GStencil(gGraph);
    }

    configure(store: GStore): GAddOn {
        this._uiToolbar.configure(store);
        this._uiStencil.configure(store);
        return this;
    }

    initialize(gNode: GNode): GAddOn {
        // 更新 GPos
        this._uiToolbar.initialize();
        // 连续初始化两次
        this._uiStencil.bind(gNode)
            .initialize()               // 标准流程，构造配置
            .initializeData();          // 非标准流程，构造数据

        return this;
    }

    id = (): any => {
        const id: any = {};
        id.toolbar = this._uiToolbar.id();
        id.stencil = this._uiStencil.id();
        return id;
    }

    css = (): any => {
        const css: any = {};
        css.toolbar = this._uiToolbar.css();
        css.stencil = this._uiStencil.css();
        return css;
    }
}

export default GAddOn;