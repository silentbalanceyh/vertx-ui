import {GLife, GView} from "./I.contract";
import GGraph from "./O.graph";
import {GStore} from "./O.event";
import Ld from '../library';
import Kt from "./I.common";

class GToolbar implements GLife, GView {

    private readonly _gGraph: GGraph = null;

    private _id: string = null;
    private _css: any = {};
    private _config: any = {};
    private _commands: Array<any> = [];

    constructor(gGraph: GGraph) {
        this._gGraph = gGraph;
    }

    configure(store: GStore): GToolbar {
        // 读取配置信息
        const config = store.inToolbar();
        const {container, css, commands = [], ...toolbarConfig} = config;

        // CSS计算
        if (css) Object.assign(this._css, css);

        // Command 绑定
        this._commands = commands;

        // ID计算
        this._id = container ? container : null;
        this._config = Ld.g6DefaultAddOn(this._id, toolbarConfig);

        return this;
    }

    initialize(): GToolbar {
        // 更新 GPos
        {
            const posRef = this._gGraph.pos();
            const config: any = {};
            config.css = this._css;
            Kt.posCompressH(posRef, config);
        }
        return this;
    }

    id = (): string => this._id;
    css = (): any => this._css;
}

export default GToolbar;