import Chn from './channel';
import Ux from "ux";
import Event from "./event";
import Fn from "./functions";

const hocPage = async (reference) => {
    /*
     * 第一个步骤
     */
    const hoc = {};
    const {
        $assist = {},        // 辅助数据
        $grid = [],          // 布局数据
        $container = {},     // 容器信息
        $controls = {},      // 控件信息
    } = reference.props;
    hoc._assist = Ux.clone($assist);
    /*
     * 构造 HocI18r 对象（用于 yiDatum操作）
     */
    const state = {};
    state.$hoc = new HocI18r(hoc);
    /*
     * 带上前缀，前端生成用
     */
    const {$router} = reference.props;
    state.$grid = Fn.configGrid($grid, $controls, $router.path());
    if (!Ux.isEmpty($container)) {
        /*
         * 带容器的处理
         */
        state.$container = Ux.clone($container);
    }
    if (!Ux.isEmpty($assist)) {
        const mounted = await Ux.asyncAssist($assist, reference, state);
        if (mounted) {
            Object.assign(state, mounted);
        }
    }
    /*
     * 设置统一的高阶函数 rxChannel
     */
    state.rxChannel = Event.rxChannel(reference);
    state.$ready = true;
    reference.setState(state);
    return state;
};
const hocControl = async (reference) => {
    const {rxChannel, event = {}} = reference.props;
    if (!Ux.isFunction(rxChannel)) {
        throw new Error("[ Ox ] 缺失了通道函数：rxChannel");
    }
    if (Ux.isEmpty(event)) {
        console.warn("[ Ox ] 当前组件中没有配置任何事件！", event);
    }
    const state = {};
    /*
     * 高阶函数，用于绑定
     */
    Object.keys(event).forEach(eventName => {
        /*
         * 构造事件发送器：Fabric 链式结构
         */
        const fabric = Event.etUniform(reference, event[eventName]);
        if (Ux.isFunction(fabric)) {
            state[eventName] = fabric;
        }
    });
    state.$ready = true;
    reference.setState(state);
};
// =====================================================
// 专用Annotation函数主接口
// =====================================================
const hoc = {
    "Page": hocPage,
    "Control": hocControl
};
/**
 * ## Origin X注解
 *
 * 使用方法：
 *
 * ```js
 * import Ex from 'ex';
 *
 * &#64;Ex.ox() -- 注释掉的调用方法，由于包含 @ 符号不可解析
 * class Component extends React.Component{
 *
 * }
 * ```
 *
 * 该注解用于高阶组件，使用Hoc方式对定义的React组件执行注解操作，采用ES7中的修饰语法
 *
 * ### 参数
 *
 * `options`中目前包括两个核心值：
 *
 * |值|含义|
 * |:---|:---|
 * |Page|页面动态渲染。|
 * |Control|控件动态渲染。|
 *
 * @method @ox
 * @param {Object} options 配置项信息
 *
 */
export default (options = {}) => {
    if (!options.type) {
        throw new Error("[ Ox ] 对不起，渲染类型丢失！")
    }
    const hocFn = hoc[options.type];
    return (target, property, descriptor) => {
        return class extends target {
            constructor(props) {
                super(props);
                this.state = {$ready: false}
            }

            async componentDidMount() {
                if (Ux.isFunction(hocFn)) {
                    await hocFn(this);
                }
            }

            render() {
                return Chn.yoRender(this, () => {
                    return super.render();
                }, options)
            }
        };
    }
}