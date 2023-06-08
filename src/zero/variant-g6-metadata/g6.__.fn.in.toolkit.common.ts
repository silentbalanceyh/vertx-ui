import {GStore} from "./g6.__.c.pojo.g.store";
import __Zn from './zero.uca.dependency';

export default {
    /*
     * 初始化配置信息的细节，配置信息来自于几个方向
     * 1. reference中的 props 属性的 config 节点（和 Zero Ui统一）
     * 2. 直接从 Cab.json 中提取 _graphic 节点中的配置信息，最终用于构造合法的图相关数据
     * 3. editor / viewer 两个组件统一使用该配置信息
     *
     * 注意：
     * 1. 不存在合并，一旦传入了 config 则 Cab 中的自动失效
     * 2. 两种配置方式只能二选一
     *
     * 提供了扩展配置：initialize 节点，不论哪种方式，这个配置都是生效的
     */
    inStore: (reference: any = {}) => {
        let graphic = {};
        const cab = __Zn.fromHoc(reference, 'graphic');
        if (cab) {
            // 将 _graphic 拷贝到变量中
            Object.assign(graphic, cab);
        }
        // 是否传入了 config 变量
        const {config} = reference.props;
        if (config) {
            // 覆盖模式，深度覆盖模式
            const replaced = __Zn.assign(graphic, config, 1);
            Object.assign(graphic, replaced);
        }
        Object.freeze(graphic);
        return graphic;
    },
    inOptions: (stored: GStore) => {
        // 构造 options 信息
        const nodeConfig = stored.inNode();
        const nodeOptions: any = {};
        const {options} = nodeConfig;
        if (options) {
            Object.assign(nodeOptions, options);
        }
        return options;
    },
    inRegistry: (stored: GStore) => {
        const stencilConfig = stored.inStencil();
        return stencilConfig.registry;
    },
}