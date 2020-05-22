import Tab from './O.tab';
import Dialog from './O.dialog';
import Ux from 'ux';

function wrapper(reference, clazz, name, callback) {
    if (callback) {
        if (Ux.isFunction(callback)) {
            /* 有名称（调用）*/
            let executor = reference.props[name];
            if (!executor) {
                const $state = reference.state ? reference.state : {};
                executor = $state[name];
            }
            callback(executor);
        } else {
            console.error("传入回调函数不对！")
        }
    } else {
        return new clazz(reference);
    }
}

export default {
    /* 专用 ExTab 对象 */
    uiTab: (reference, consumer) => wrapper(reference, Tab, "__tabs", consumer),
    /* 专用 Dialog 对象 */
    uiDialog: (reference, consumer) => wrapper(reference, Dialog, "__dialog", consumer),
}