import Ux from 'ux';

const _seekComponent = (attrs = {}, control = {}) => {
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
const _seekContainer = (attrs = {}, control = {}, componentType) => {
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
export default (control = {}) => {
    const attrs = {};
    const {type = "COMPONENT", sign = ""} = control;
    if (!sign || 64 !== sign.length) {
        // console.error("[ Ex ] 使用的 Ox 组件签名不合法，请检查签名信息！", sign, sign ? sign.length : null);
    }
    /*
     * 第一层解析，解析 component，这是必须的
     */
    const $component = Ux.immutable(["LIST", "FORM", "COMPONENT"]);
    if ("CONTAINER" === type) {
        /*
         * 容器配置，由于该类型，所以是必须
         */
        _seekContainer(attrs, control, type);
        if (!attrs.container) {
            throw new Error("[ Ex ] 由于 type = CONTAINER，必须包含 containerName！");
        }
    } else if ($component.contains(type)) {
        /*
         * LIST / COMPONENT / FORM
         * 容器（可选）
         */
        _seekComponent(attrs, control);
        _seekContainer(attrs, control, type);   // 加入 type 作为 component 类型
    } else {
        throw new Error(`[ Ex ] 使用了不支持的类型：type = ${type}`);
    }
    return attrs;
}