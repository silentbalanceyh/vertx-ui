import Ux from 'ux';
import Fn from '../functions';

export default (reference = {}, config = {}) => {
    const props = Fn.props(reference);
    /*
     * $app
     * $user
     * $profile：保留属性
     * $router
     * $menus
     * */
    const uniform = Ux.toUniform(props,
        "app", "user", "router",
        "menus",
        "hotel"     // 旧系统专用
    );
    Object.keys(props)
        .filter(propKey => !!propKey)
        .filter(propKey =>
            propKey.startsWith('fn') ||
            propKey.startsWith('rx')
        )
        .forEach(propKey => uniform[propKey] = props[propKey]);
    /*
     * 特殊引用
     * reference：父引用
     * atman: 当前引用
     */
    if (props.reference) uniform.reference = props.reference;
    // uniform.atman = reference;
    if (!uniform.config) uniform.config = {};
    Object.assign(uniform.config, config);
    return uniform;
};