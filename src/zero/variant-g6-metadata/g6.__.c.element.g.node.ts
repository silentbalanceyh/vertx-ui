import {GStore} from "./g6.__.c.pojo.g.store";
import {GLife} from "./g6.__.c.interface.contract";

import {ModeGroup, OptionKey} from "./g6.__.v.enum.constant";
import {GRegistry} from "./g6.__.c.element.g.registry";
import Kt from './g6.__.fn.on.element.process';
import __Zn from './zero.uca.dependency';
import {GGroup} from "./g6.__.c.unit.g.group";

export class GNode implements GLife {
    private readonly _gGraph: any = null;
    private readonly _gRegistry: GRegistry = null;
    private _id: string = null;
    private _css: any = {};
    private _options: any = {};
    // 两个特殊变量
    private _modeGroup: ModeGroup = ModeGroup.None;
    /**
     * 数据本体，两种格式
     * 1. Array：不分组的时候的格式
     * 2. Map：分组时的格式
     */
    private _data: any = null;

    constructor(gGraph: any) {
        this._gGraph = gGraph;
        this._gRegistry = new GRegistry(gGraph);
    }

    configure(store: GStore): GNode {
        // 注册器配置
        this._gRegistry.configure(store);

        const config = store.inNode();
        const {options, css, source} = config;

        // 构造 options
        if (options) {
            Object.assign(this._options, options);
            if (options[OptionKey.MODE_GROUP]) this._modeGroup = options[OptionKey.MODE_GROUP];
        }

        // CSS计算
        if (css) {
            Object.assign(this._css, css);
            Object.freeze(this._css);
        }

        // ID计算
        this._id = source ? source : null;

        return this;
    }

    options = () => this._options;

    initialize(gEvent: any): GNode {
        // 注册器初始化
        this._gRegistry.initialize(gEvent.reference());
        // 数据初始化
        if (this._id) {
            // 数据处理部分
            const reference = gEvent.reference();
            const sourceData = __Zn.onDatum(reference, this._id);
            // 分组模式
            const group = this._modeGroup;
            if (ModeGroup.None === group) {
                // 不分组
                this._data = Kt.onDataFlat(sourceData, this._options, gEvent);
            } else {
                // 执行分组
                const options = __Zn.clone(this._options);
                options.css = this._css;
                this._data = Kt.onDataGroup(sourceData, options, gEvent);
            }
        } else {
            // 解决：Cannot convert undefined or null to object
            this._data = {};
        }

        return this;
    }

    groupConfig() {
        const groupNames = Object.keys(this._data);
        const groupArray = [];
        groupNames.forEach(name => {
            const group: GGroup = this._data[name];
            const groupData = group.build();
            groupArray.push(groupData);
        });
        return groupArray;
    }

    groupNodes(type: string) {
        const registryFn = this._gRegistry.instanceFn(type);
        if (__Zn.isFunction(registryFn)) {
            const groupNames = Object.keys(this._data);
            const groupMap: any = {};
            groupNames.forEach(name => {
                const group: GGroup = this._data[name];
                const groupName = group.name();
                groupMap[groupName] = group.children()
                    .map(registryFn)
                    .filter(item => undefined !== item);
            });
            return groupMap;
        }
    }
}