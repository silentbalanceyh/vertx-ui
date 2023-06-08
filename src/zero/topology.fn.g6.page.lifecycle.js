import {GEvent} from "./variant-g6-metadata";
import __Zn from './zero.module.dependency';

/**
 * ## 「标准」`Ux.g6PageInit`
 *
 * @memberOf module:g6/zero
 * @param reference
 * @param onInit
 */
const g6PageInit = (reference, onInit) => {
    const state = {};
    /*
     * 通用树形：
     * - $visible，是否打开弹窗，弹窗状态。
     * - $submitting，防重复提交（正在提交）
     * - $inited，如果打开窗口是表单则表示表单的初始化数据信息
     */
    state.$submitting = false;
    state.$visible = false;
    state.$inited = undefined;
    /*
     * 构造 GEvent
     */
    state.$gEvent = GEvent.create(reference);
    onInit(reference, state).then(processed => {

        // 准备完成
        __Zn.of(reference).in(processed).ready().done();
        // processed.$ready = true;
        // reference.?etState(processed);
    })
};
/**
 * ## 「标准」`Ux.g6PageUp`
 * @memberOf module:g6/zero
 * @param reference
 * @param virtualRef
 * @param onInit
 */
const g6PageUp = (reference, virtualRef, onInit) => {
    const {data} = reference.props;
    const $previous = virtualRef.props.data;
    if (data && $previous) {
        if (__Zn.isDiff($previous, data)) {
            /*
             * 重新刷新，只要 data 发生改变则执行刷新
             */
            __Zn.of(reference).readying().handle(() => {

                const startState = __Zn.clone(reference.state);
                onInit(reference, startState).then(state => {

                    __Zn.of(reference).in(state).ready().done();
                    // state.$ready = true;
                    // reference.?etState(state);
                })
            })
            // reference.?etState({$ready: false});
            // const startState = __Zn.clone(reference.state);
            // onInit(reference, startState).then(state => {
            //     state.$ready = true;
            //     reference.?etState(state);
            // })
        }
    }
};
export default {
    g6PageInit,
    g6PageUp,
}