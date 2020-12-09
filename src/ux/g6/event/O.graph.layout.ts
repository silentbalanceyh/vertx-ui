import Ld from '../library';
import {Abs} from '../internal';
import GPos from "./O.graph.pos";
import * as G6 from '@antv/g6';
import {Dev} from "./I.common";

const mountFn = {
    "radial": (config: any = {}, pos: GPos) => {
        const center = pos.center();
        config.center = [center.x, center.y];
        return config;
    }
}

class GLayout {

    private readonly _config: any = {};
    private readonly _type: string = null;

    constructor(config: any = {}) {
        const {type, ...rest} = config;
        const configLayout = Ld.L[type] ? Ld.L[type] : {};
        this._type = type;
        // 合并配置处理，用于构造布局信息
        const combine = Abs.clone(rest);
        this._config = Object.assign(combine, configLayout);
        Object.freeze(this._config);
    }

    instance(pos: GPos, additional) {
        const layout = new G6.Layout[this._type];
        const mounter = mountFn[this._type];
        const layoutCfg = Abs.clone(this._config);
        if (Abs.isFunction(mounter)) {
            mounter(layoutCfg, pos);
            if (additional) {
                Object.assign(layoutCfg, additional)
            }
        }
        Dev.dgGraphic(layoutCfg, "（布局）Layout 配置");
        layout.updateCfg(layoutCfg);
        return layout;
    }
}

export default GLayout;