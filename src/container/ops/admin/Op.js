import Ux from 'ux';
import Ex from 'ex';
import Oi from "oi";
import ExTpl from './tpl/UI';

const yoDynamic = (reference) => {
    const attrs = Ex.yoAmbient(reference);
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
const yoStatic = (reference) => {
    const {$collapsed = false} = reference.state;
    const homepage = Ux.fromHoc(reference, "nav");
    const attrs = Ex.yoAmbient(reference, {homepage});
    attrs.$collapsed = $collapsed;
    return attrs;
};

const yoContainer = (reference) => {
    const {$dynamic = false} = reference.state;
    const inherit = $dynamic ? yoDynamic(reference) : yoStatic(reference);
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
        Component = ExTpl;
    }
    return {
        Component,
        inherit,
    }
};
const yoComponent = (reference) => {
    const inherit = Ex.yoComponent(reference);
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
};
const yiContainer = (reference, state = {}) => {
    const {$secure = true, $menus} = reference.props;
    state.$componentKey = Ux.randomUUID();
    if ($secure) {
        // 登陆控制（框架专用）
        Ux.isAuthorized(reference);
        // 在登录控制时，只有菜单不存在的时候才执行 fnApp 初始化菜单
        if (!$menus || !$menus.is()) {
            // 如果有这个函数
            if (Ux.isFunction(reference.props.fnApp)) {
                reference.props.fnApp();
            }
        }
        reference.setState(state);
    } else {
        reference.setState(state);
    }
    return Ux.promise(state);
};
const yuContainer = (reference, virtualRef = {}) => {
    if (Ux.isRoute(reference.props, virtualRef.props)) {
        /*
         * 这行代码会引起闪屏的BUG
         * reference.setState({$ready: false});
         */
        Ex.yiLayout(reference)
            .then(state => yiContainer(reference, state))
            .catch(error => {
                // 模板错误
                console.error(error);
            })
    }
};
export default {
    yoContainer,
    yoComponent,

    yiContainer, // 初始化页面
    yuContainer, // 更新页面
}