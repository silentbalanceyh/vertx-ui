import U from 'underscore';
import Ux from 'ux';
import Event from '../event';

const yiThis = async (reference) => {
    const {rxChannel, event = {}} = reference.props;
    if (!U.isFunction(rxChannel)) {
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
        const fabric = Event.onBind(reference, event[eventName]);
        if (U.isFunction(fabric)) {
            state[eventName] = fabric;
        }
    });
    state.$ready = true;
    reference.setState(state);
};

export default {
    yiThis,
}