import Ux from 'ux';

const seekState = (uniform = {}, reference, key) => {
    /*
     * 先在属性中查询（属性优先）
     * Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VR5V
     */
    let value = reference.props[key];
    if (undefined !== value) {
        uniform[key] = value;
    } else {
        value = reference.state ? reference.state[key] : null;
        if (undefined !== value) {
            uniform[key] = value;
        }
    }
};

const seekSelected = (uniform = {}, reference, key) => {
    /*
     * 属性中包含就处理
     */
    let value = reference.props[key];
    if (undefined !== value) {
        uniform[key] = value;
    }
};
const seekCombine = (reference) => {
    const {options = {}} = reference.state ? reference.state : {};
    let stateOpt = Ux.clone(options);
    const {$options = {}} = reference.props ? reference.props : {};
    if (!Ux.isEmpty($options)) {
        /*
         * 如果 $options 中存在 identifier
         * 那么该操作会覆盖掉 identifier
         */
        Object.assign(stateOpt, $options);
    }
    return Ux.sorterObject(stateOpt);
}

const seekOption = (uniform = {}, reference) => {

    /*
    * 选项合并处理
    * reference.props -> $options
    * reference.state -> $options
    * 合并到一起，state 中的 $options 优先
    * 最后 $hoc 部分
    */
    let optionData = uniform.$options ? Ux.clone(uniform.$options) : {};
    const {$options = {}} = reference.state ? reference.state : {};
    Object.assign(optionData, $options);
    /*
     * $hoc 存在的时候才读取 module
     */
    const {$hoc} = reference.state ? reference.state : {};
    if ($hoc) {
        let module = Ux.fromHoc(reference, "module");
        if (!module) module = {};
        if (module.$options) {
            Object.assign(optionData, module.$options);
        }
    }
    uniform.$options = Ux.sorterObject(optionData);
};
const seekComponent = (attrs = {}, control = {}) => {
    const {
        componentConfig = {},
        componentData = "",
        componentName = "",
    } = control;
    attrs.config = Ux.clone(componentConfig);
    attrs.source = componentData;
    attrs.key = control.key;
    attrs.pageId = control['pageId'];
    attrs.name = componentName;
};
const seekContainer = (attrs = {}, control = {}, componentType) => {
    const {containerConfig, containerName} = control;
    if (containerName) {
        // attrs.name = containerName;
        // 名字只可以有一个，否则会出现 container 覆盖 component 原始的名字导致渲染不正常
        attrs.container = {
            name: containerName,
            config: containerConfig ? containerConfig : {},
            // For $metadata generation
            key: control.key,
            pageId: control['pageId'],
            componentType,
        };
    }
};
export default {
    seekState,
    seekSelected,
    seekComponent,
    seekContainer,
    seekCombine,        // seekOptionPre
    seekOption,
}