import Ux from 'ux';
import React from 'react';
import Event from './Op.Event';

const yiPage = (reference) => {
    const {config = {}} = reference.props;
    const {
        table = {}, dialog = "", op,
        form = "",
        /*
         * 提交过后是否关闭窗口
         * = false: 如果 false 则继续添加，只重置
         * = true：如果 true 则添加完后关闭窗口
         */
    } = config;
    /*
     * 表格
     */
    const state = {};
    const executors = Ux.configExecutor(reference, Event.EVENTS);
    /*
     * 窗口
     */
    state.$dialog = Ux.configDialog(reference, dialog);
    /*
     * 提取当前 Dialog 需要使用的 Form
     */
    const ref = Ux.onReference(reference, 1);
    state.$table = Ux.configTable(ref, table, executors);
    /*
     * 按钮处理
     */
    state.$button = Ux.configAnchor(reference, op, {
        /*
         * 添加的回调函数，主要用于生成状态
         */
        add: Event.onOpen(reference)
    });

    state.$ready = true;
    const {$form = {}} = ref.props;
    const Component = $form[form];
    if (Component) {
        state.fnComponent = ($inited = {}, $mode) => {
            /*
             * 传入的是值
             */
            const inherit = Event.yoInherit(reference);
            inherit.$inited = $inited;
            inherit.$mode = $mode;
            const {value} = reference.props;
            if (value) {
                inherit.value = value;
            }
            return (
                <Component {...inherit}/>
            );
        };
        reference.setState(state);
    } else {
        console.error($form, form);
        state.error = `Component in dialog has been missed. key = ${form}`;
        reference.setState(state);
    }
};
export default {
    yiPage
}