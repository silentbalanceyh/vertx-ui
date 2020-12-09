import Abs from '../../abyss';
import {GEvent} from '../event';

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
        processed.$ready = true;
        reference.setState(processed);
    })
};
const g6PageUp = (reference, virtualRef, onInit) => {
    const {data} = reference.props;
    const $previous = virtualRef.props.data;
    if (data && $previous) {
        if (Abs.isDiff($previous, data)) {
            /*
             * 重新刷新，只要 data 发生改变则执行刷新
             */
            reference.setState({$ready: false});
            const startState = Abs.clone(reference.state);
            onInit(reference, startState).then(state => {
                state.$ready = true;
                reference.setState(state);
            })
        }
    }
};
/*
 * 状态配置专用
 * $dialog: 关系管理窗口配置信息
 *
 */
export default {
    g6PageInit,
    g6PageUp
}