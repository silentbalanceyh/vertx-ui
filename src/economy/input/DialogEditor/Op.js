import Ux from 'ux';
import React from 'react';
import Event from './Op.Event';

const yiEdition = (reference, config = {}) => {
    const {
        table = {}, dialog = "", op,
        form = "",
        /*
         * 提交过后是否关闭窗口
         * = false: 如果 false 则继续添加，只重置
         * = true：如果 true 则添加完后关闭窗口
         */
    } = config;
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
    /*
     * executors 格式化，DialogEditor 专用
     */
    const normalized = {};
    Object.keys(executors).forEach(key => {
        if (Ux.isFunction(executors[key])) {
            const normalizeFn = executors[key](reference);
            if (Ux.isFunction(normalizeFn)) {
                normalized[key] = normalizeFn;
            }
        }
    });
    state.$table = Ux.configTable(ref, table, normalized);
    /*
     * 按钮处理
     */
    state.$button = Ux.configAnchor(reference, op, {
        /*
         * 添加的回调函数，主要用于生成状态
         */
        add: Event.onOpen(reference)
    });
    /*
     * initialValue
     */
    const {value = []} = reference.props;
    if (Ux.isArray(value)) {
        state.initialValue = value;
    }
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
        state.$ready = true;
        reference.setState(state);
    } else {
        console.error($form, form);
        state.error = `Component in dialog has been missed. key = ${form}`;
        reference.setState(state);
    }
};

const yiView = (reference, config) => {
    const {
        table = {},
        /*
         * 提交过后是否关闭窗口
         * = false: 如果 false 则继续添加，只重置
         * = true：如果 true 则添加完后关闭窗口
         */
    } = config;
    const state = {};
    /*
     * 提取当前 Dialog 需要使用的 Form
     */
    const ref = Ux.onReference(reference, 1);
    /*
     * executors 格式化，DialogEditor 专用
     */
    state.$table = Ux.configTable(ref, table, {});
    state.$ready = true;
    reference.setState(state);
};

const yiPage = (reference) => {
    const {config = {}, readOnly = false} = reference.props;
    /*
     * 表格
     */
    if (readOnly) {
        yiView(reference, config);
    } else {
        yiEdition(reference, config);
    }
};
const yuPage = (reference, virtualRef) => {
    const prevValue = virtualRef.props.value;
    const curValue = reference.props.value;
    /*
     * 发生改变的时候操作
     */
    if (prevValue !== curValue) {
        /*
         * Form 处理
         */
        const ref = Ux.onReference(reference, 1);
        const {form} = ref.props;
        /*
         * 是否操作过（未操作就是重置状态）
         */
        const isTouched = form.isFieldsTouched();
        if (isTouched) {

        } else {
            /*
             * 重置表单
             */
            const {initialValue = []} = reference.state;
            const {onChange, id} = reference.props;
            if (Ux.isFunction(onChange)) {
                /*
                 * 初始化表单
                 */
                reference.setState({data: initialValue});
                if (0 < initialValue.length) {
                    /*
                     * 编辑重置
                     */
                    const state = {};
                    state[id] = initialValue;
                    Ux.formHits(ref, state);
                } else {
                    /*
                     * 添加重置
                     */
                    Ux.formReset(ref, [id])
                }
            }
        }
    }
};
export default {
    yiPage,
    yuPage,
}