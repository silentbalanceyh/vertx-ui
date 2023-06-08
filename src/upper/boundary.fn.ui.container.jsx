import Ux from 'ux';
import {_IxDialog, _IxTab} from "./variant-container";

function __uiWrapper(reference, clazz, name, callback) {
    if (callback) {
        if (Ux.isFunction(callback)) {
            /* 有名称（调用）*/
            let executor = reference.props[name];
            if (!executor) {
                const $state = reference.state ? reference.state : {};
                executor = $state[name];
            }
            if (executor) {
                callback(executor);
            }
        } else {
            console.error("传入回调函数不对！")
        }
    } else {
        return new clazz(reference);
    }
}

export default {
    uiTab: (reference, consumer) => __uiWrapper(reference, _IxTab, "__tabs", consumer),
    uiDialog: (reference, consumer) => __uiWrapper(reference, _IxDialog, "__dialog", consumer),
}