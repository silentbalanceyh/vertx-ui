import GGraph from "./O.graph";
import {GLife} from "./I.contract";
import {GStore} from "./O.event";
import {Abs} from './I.common';
import Ld from '../library';

class GRegistry implements GLife {
    private readonly _gGraph: GGraph = null;
    private _config: Array<any> = [];
    private _registryClass: any = {};

    constructor(gGraph: GGraph) {
        this._gGraph = gGraph;
    }

    configure(store: GStore): GRegistry {
        this._config = store.inRegistry();
        return this;
    }

    initialize(reference: any): GRegistry {
        /*
         * 注册器底层调用 registryNode / registryEdge 用来注册边和节点，配置数据三个来源
         *
         * 1. 当前 React 组件中的 $registry 属性值
         * 2. 直接调用 Ux.g6Registry 中默认库的内容
         * 3. 当前对象直接绑定
         */
        const {$registry = {}} = reference.props;
        const combiner: any = {};
        if (this._config && Abs.isArray(this._config)) {
            this._config.forEach(regKey => combiner[regKey] = Ld.g6Registry(regKey));
        }

        Object.keys($registry).forEach(regKey => {
            if (Abs.isFunction($registry[regKey])) {
                combiner[regKey] = $registry[regKey];
            }
        });
        // 最终结果
        this._registryClass = combiner;
        return this;
    }

    /*
     * 创建节点实例
     *
     * 1. 一阶函数：instance ( input, type )
     * 2. 二阶函数：instanceFn ( type ) => ( input )
     */
    instance(input: any, type: any) {
        const NodeCls = this._registryClass[type];
        if (Abs.isFunction(NodeCls)) {

            return new NodeCls(input);
        } else {
            console.error(`注册类型失败，${type}`);
        }
    }

    instanceFn = (type: string) => (input: any) => this.instance(input, type);
}

export default GRegistry;