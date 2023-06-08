import Ux from 'ux';
import __EVENT_CONFIGURATION from './variant-event';

const onOp = (reference, metadata = {}) => {
    const {event = "", config = {}} = metadata;
    const executor = __EVENT_CONFIGURATION[event];
    if (Ux.isFunction(executor)) {
        return executor(config);
    } else {
        console.error("[ Ex ] 对不起，事件无法绑定！", event);
    }
};
export default {
    onOp,
}