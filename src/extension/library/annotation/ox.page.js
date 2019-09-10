import Ux from 'ux';
import {Dsl, HocI18r} from 'entity';
import U from "underscore";
import Fn from '../functions';
import Event from '../event';

const yiThis = async (reference) => {
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
        /*
         * 构造辅助数据集
         */
        const ajaxParser = Fn.parserOfAjax(reference);
        const keys = Object.keys($assist);
        const promises = keys
            .map(key => $assist[key])
            .filter(config => undefined !== config)
            .map(config => ajaxParser.parseRequest(config));
        const response = await Ux.parallel(promises);
        /*
         * 给 state 赋值
         */
        keys.forEach((key, index) => {
            /*
             * Assist 专用
             */
            const stateKey = `$a_${key.replace(/\./g, '_')}`;
            const data = response[index];
            if (U.isArray(data)) {
                state[stateKey] = Dsl.getArray(data);
            }
        });
    }
    /*
     * 设置统一的高阶函数 rxChannel
     */
    state.rxChannel = Event.rxChannel(reference);
    state.$ready = true;
    reference.setState(state);
    return state;
};
export default {
    yiThis,
}