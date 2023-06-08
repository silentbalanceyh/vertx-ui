import Ux from "ux";
import {HocI18r} from 'entity';
import rxChannel from './aero.@fn.rx.channel.spread';
import __Zn from './zero.module.dependency';
import __ET from './aero.fn.et.capture';

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
    state.$grid = __Zn.configGrid($grid, $controls, $router.path());
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
    state.rxChannel = rxChannel(reference);

    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
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
        const fabric = __ET.etUniform(reference, event[eventName]);
        if (Ux.isFunction(fabric)) {
            state[eventName] = fabric;
        }
    });
    
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
};
// =====================================================
// 专用Annotation函数主接口
// =====================================================
export default {
    Page: hocPage,
    Control: hocControl
}