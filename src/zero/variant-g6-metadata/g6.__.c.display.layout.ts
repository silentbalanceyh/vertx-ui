import {GPos} from "./g6.__.c.unit.g.pos";
import * as G6 from '@antv/g6';
import __Zn from './zero.uca.dependency';

const Ld = __Zn.G6_LIBRARY;

const mountFn = {
    "radial": (config: any = {}, pos: GPos) => {
        const center = pos.center();
        config.center = [center.x, center.y];
        return config;
    }
}

export class GLayout {

    private readonly _config: any = {};
    private readonly _type: string = null;

    constructor(config: any = {}) {
        const {type, ...rest} = config;
        const configLayout = Ld.L[type] ? Ld.L[type] : {};
        this._type = type;
        // 合并配置处理，用于构造布局信息
        const combine = __Zn.clone(rest);
        this._config = Object.assign(combine, configLayout);
        Object.freeze(this._config);
    }

    instance(pos: GPos, additional) {
        // eslint-disable-next-line new-parens
        const layout = new G6.Layout[this._type];
        const mounter = mountFn[this._type];
        const layoutCfg = __Zn.clone(this._config);
        if (__Zn.isFunction(mounter)) {
            mounter(layoutCfg, pos);
            if (additional) {
                Object.assign(layoutCfg, additional)
            }
        }
        __Zn.dgGraphic(layoutCfg, "（布局）Layout 配置");
        layout.updateCfg(layoutCfg);
        return layout;
    }
}