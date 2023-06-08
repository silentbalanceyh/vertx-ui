import Ux from 'ux';
import yoAmbient from './channel.@fn.yo.ambient';
import __SK from './channel.__.fn.seek.yo.processor';

const yoContainer = (reference, Component) => {
    const {$collapsed = false} = reference.state;
    const homepage = Ux.fromHoc(reference, "nav");
    const inherit = yoAmbient(reference, {homepage});
    inherit.$collapsed = $collapsed;
    return {
        Component,
        inherit,
    }
}
const yoControl = (control = {}) => {
    const attrs = {};
    const {type = "COMPONENT", sign = ""} = control;
    if (!sign || 64 !== sign.length) {
        // console.error("[ Ex ] 使用的 Ox 组件签名不合法，请检查签名信息！", sign, sign ? sign.length : null);
    }
    /*
     * 第一层解析，解析 component，这是必须的
     */
    if ("CONTAINER" === type) {
        /*
         * 容器配置，这种情况下，只有 container 节点，没有其他节点
         * component 节点没有
         */
        __SK.seekContainer(attrs, control, type);
        if (!attrs.container) {
            throw new Error("[ Ex ] 由于 type = CONTAINER，必须包含 containerName！");
        }
        /* 表示只有 container 容器，不包含 component */
        attrs.isContainer = true;
    } else if (["LIST", "FORM", "COMPONENT"].includes(type)) {
        /*
         * LIST / COMPONENT / FORM
         * 容器（可选）
         * 注意顺序，这里需要
         * 1）先处理 container 级别的配置
         * 2）再处理 component 级别的配置，最终这里需要执行覆盖
         */
        __SK.seekContainer(attrs, control, type);   // 加入 type 作为 component 类型
        __SK.seekComponent(attrs, control);
    } else {
        throw new Error(`[ Ex ] 使用了不支持的类型：type = ${type}`);
    }
    return attrs;
}
export default {
    yoContainer,
    yoComponent: yoAmbient,     // 「动态」环境数据（统一处理）
    yoControl,
}