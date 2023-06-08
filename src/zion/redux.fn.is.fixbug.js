import __Zn from './zero.module.dependency';
import {DataObject} from 'zme';

const Cv = __Zn.Env;
/*
 * 解决 redux 模式下的 BUG 问题
 */
const isLoading = (reference) => {
    let submitting = __Zn.ambValue(reference, Cv.K_NAME.SUBMITTING);
    if (submitting instanceof DataObject) {
        /*
         * redux 模式下的加载效果处理
         * DataObject -> loading 数据
         */
        submitting = submitting._("loading");
    }
    return submitting;
}
export default {
    isLoading,
}