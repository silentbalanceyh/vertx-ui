import __Zn from './zero.module.dependency';
import __Yo from './lkway.fn.yo.under.prop';

// on
const onProp = (props = {}, ...keys) => {
    const inherits = {};
    // Fix Issue
    let targetFor = [];
    if (1 === keys.length && __Zn.isArray(keys[0])) {
        targetFor = keys[0];
    } else {
        targetFor = keys;
    }
    targetFor.forEach(key => {
        const targetKey = `$${key}`;
        if (props.hasOwnProperty(targetKey)) {
            inherits[targetKey] = props[targetKey];
        }
    });
    // 特殊方法专用：reference和fnOut
    // fnOut：专用写Redux状态的方法
    if (props.fnOut) {
        inherits.fnOut = props.fnOut;
    }
    return inherits;
};

const onUniform = (props, ...keys) => {
    const item = __Yo.yoDatum(props);
    const defaultProp = [
        "app",      // 应用程序数据
        "user",     // 用户数据
        "profile",  // 账号数据
        "router",   // 路由数据
        "parent",   // 主记录数据
        "submitting"    // 防重复提交专用
    ].concat(keys);
    const common = onProp.apply(this, [props].concat(defaultProp));
    const uniform = {
        ...item,
        ...common
    };
    {
        /*
         * Could not find "store" in the context of "Connect(Component)".
         * Either wrap the root component in a <Provider>,
         * or pass a custom React context provider to <Provider> and the corresponding React context consumer to Connect(Component) in connect options.
         * 这个问题的根源是直接调用了 cloneElement 使得 React 和 Redux 框架并没有连接，无法读取对应的 store 变量
         * 此处方法属于总控型，直接改写 cloneElement 方法，使得开发人员无法在框架内部感知 store 的注入，即代码中所有调用了
         * React.cloneElement 的地方会默认提供 store 变量进行复制，属于底层高阶修改
         *
         * 旧方案：重写了 cloneElement 方法：
         * 1）只有在调用 React.cloneElement 时会注入 store 变量，并且是在没有 store 时注入，如果显示传入则忽略
         * 2）整个框架中只有在构造子组件时，会遇到 React.cloneElement 方法，维持最小化原则
         * 3）此处代码只执行一次，不会执行多次，`entry.expr.js`中所有代码都只会一次执行，而且该方法可无限递归而不引起死循环
         *
         * 该方案会引起很大的代价，所以最终决定在 onUniform 中进行按需加载模式
         */
        const {store, skin} = props;
        if (store && !uniform.store) {
            uniform.store = store;
        }
        /*
         * Ant V5 设置中的核心技术
         * Css-In-JS
         * skin = {
         *      token: {},
         *      theme: Theme
         * }
         */
        if (skin && !uniform.skin) {
            uniform.skin = skin;
        }
    }
    return uniform;
};
const onColor = (reference) => {
    const {$settings = {}} = reference.props;
    return $settings.colorPrimary ? $settings.colorPrimary : __Zn.Env.CSS_COLOR;
}
export default {
    // on
    onColor,
    onProp,
    onUniform,
}