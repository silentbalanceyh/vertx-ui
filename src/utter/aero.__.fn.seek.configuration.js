import Ux from "ux";

const seekData = (inherit, source = "") => {
    /*
     * 读取上层引用
     */
    if (source) {
        const {reference} = inherit;
        const state = reference.state ? reference.state : {};
        const props = Ux.clone(inherit);
        return Ux.parseValue(source, {state, props});
    }
};
const __seekFabric = (attrs = {}, config = {}, target) => {
    if (target) {
        const {$fabric = {}} = target;
        /*
         * 命中当前 control 的信息
         */
        if (!Ux.isEmpty($fabric)) {
            const fabric = $fabric[config.key];
            if (fabric) {
                /*
                 * 直接读取 $fabric 专用数据信息
                 * （当前）
                 * 1）这里需要注意的是 $fabric 中的数据会进行一次筛选（在配置中针对 control 筛选）
                 * 2）筛选过后，会直接合并到 attrs 中，如果出现了重名，原始的内容会被覆盖掉，所以请小心
                 */
                Object.assign(attrs, fabric);
            }
            /*
             * 直接注入 $fabric 处理
             * （继承）
             */
            attrs.$fabric = $fabric;
        }
    }
}
const seekFabric = (attrs = {}, config = {}, reference = {}) => {
    /**
     * 先从 props 中读取 $fabric 数据，如果 $fabric 存在则执行第一轮处理
     */
    __seekFabric(attrs, config, reference.props);
    /**
     * 然后从 state 中读取 $fabric 数据，存在则执行第一轮处理
     */
    __seekFabric(attrs, config, reference.state);
}

const seekInherit = (attrs = {}, config) => {
    // 容器主键
    attrs.key = config.key;
    // $metadata构建
    const $metadata = {};
    $metadata.key = config.key;
    $metadata.type = config.name;
    $metadata.page = config['pageId'];
    if (config.componentType) {
        // 只有容器会使用
        $metadata.componentType = config.componentType;
    }
    attrs.$metadata = $metadata;
    /*
     * Fabric 传入值
     */
    const {reference} = attrs;
    if (reference) {
        /* 处理 Fabric 的查询功能 */
        seekFabric(attrs, config, reference);
        const {$controls} = reference.props;
        if ($controls) {
            Object.freeze($controls);   // 不可不变更的属性
            attrs.$controls = $controls;
        }
    }
};
export default {
    seekData,
    seekFabric,
    seekInherit,
}