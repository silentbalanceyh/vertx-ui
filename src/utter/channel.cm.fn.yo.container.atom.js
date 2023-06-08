import Ux from 'ux';
import yoAmbient from './channel.@fn.yo.ambient';

const __yoDynamic = (reference, Oi = {}) => {
    const attrs = yoAmbient(reference);
    /*
     * 从 state 中继承的专用属性
     */
    const {
        $secure = false,
        $tpl = {},
        $container = {},
        $grid = {},
        $assist = {},
    } = reference.state;
    /*
     * 是否安全页面
     */
    attrs.$secure = $secure;
    /*
     * 最顶层（非页面层，模板层）
     */
    const tplComponent = Oi[$tpl.name];
    if (tplComponent) {
        let tpl = Ux.clone($tpl);
        tpl.component = tplComponent;
        attrs.$tpl = tpl;
    }
    /*
     * 容器层（第二层）
     */
    const containerComponent = Oi[$container.name];
    if (containerComponent) {
        let container = Ux.clone($container);
        container.component = tplComponent;
        attrs.$container = container;
    }
    /*
     * 组件层（核心Page组件，从Page开始）
     */
    const $component = {};
    $component.grid = $grid;
    $component.assist = $assist;
    attrs.$component = $component;
    return attrs;
};
const __yoStatic = (reference) => {
    const {$collapsed = false} = reference.state;
    const homepage = Ux.fromHoc(reference, "nav");
    const attrs = yoAmbient(reference, {homepage});
    attrs.$collapsed = $collapsed;
    return attrs;
};
const yoAtomContainer = (reference, ComponentDefault, Oi) => {
    const {$dynamic = false} = reference.state;
    const inherit = $dynamic ? __yoDynamic(reference, Oi) : __yoStatic(reference);
    // 动态和静态结合
    let Component;
    if ($dynamic) {
        const {$tpl} = inherit;
        if ($tpl) {
            Component = $tpl.component;
            if (Component) {
                inherit.config = $tpl.config;
            }
        }
    } else {
        // 修改模板
        Component = ComponentDefault;
    }
    return {
        Component,
        inherit,
    }
}
const yoAtomComponent = (reference) => {
    const inherit = yoAmbient(reference);
    const {$dynamic = false} = reference.state;
    // 动态专用处理
    if ($dynamic) {
        /*
         * 抽取核心配置数据
         */
        const {
            $assist = {},    // 辅助数据
            $container = {}, // 页面容器
            $grid = [],      // 布局数据
            $controls = {},  // 控件数据
        } = Ux.clone(reference.state);
        inherit.$assist = Ux.clone($assist);
        inherit.$grid = Ux.clone($grid);
        inherit.$controls = Ux.clone($controls);
        inherit.$container = Ux.clone($container);    // 页面本身是否带容器，一般是 OxCard这种
    }
    return inherit;
}
export default {
    yoAtomContainer,
    yoAtomComponent
}