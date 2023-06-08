import React from 'react';
import {Table} from 'antd';
import {Dialog} from 'zi';

import Op from "./Op";
import FormComponent from "./UI.Form";
import __Zn from "../zero.uca.dependency.table.UNLOCK";
import "./Cab.norm.scss";
import Sk from 'skin';

const UCA_NAME = "DialogEditor";
// =====================================================
// componentInit/componentUp
// =====================================================
const yiEdition = (reference, config = {}) => {
    const {
        table = {}, dialog = "", op,
        /*
         * 提交过后是否关闭窗口
         * = false: 如果 false 则继续添加，只重置
         * = true：如果 true 则添加完后关闭窗口
         */
    } = config;
    const state = {};
    const {$rows = {}} = reference.props;
    /*
     * EVENTS中的默认函数
     * fnEdit
     * fnDelete
     * 上层传入 $rows 对象，同样包含了其他函数
     */
    const events = __Zn.clone(Op.EVENTS);
    Object.assign(events, $rows);
    const executors = __Zn.configExecutor(reference, events);
    /*
     * 窗口
     */
    state.$dialog = __Zn.configDialog(reference, dialog);
    /*
     * 提取当前 Dialog 需要使用的 Form
     */
    const ref = __Zn.onReference(reference, 1);
    /*
     * executors 格式化，DialogEditor 专用
     */
    const normalized = {};
    Object.keys(executors).forEach(key => {
        if (__Zn.isFunction(executors[key])) {
            const normalizeFn = executors[key](reference);
            if (__Zn.isFunction(normalizeFn)) {
                normalized[key] = normalizeFn;
            }
        }
    });
    const tableRef = __Zn.configTable(ref, table, normalized);
    state.$table = tableRef;
    if (tableRef.rowKey) {
        /*
         * 方便后期编辑、添加、删除
         */
        state.$keyField = tableRef.rowKey;
    }
    /*
     * 按钮处理
     */
    state.$button = __Zn.configAnchor(reference, op, {
        /*
         * 添加的回调函数，主要用于生成状态
         */
        add: Op.onOpen(reference)
    });
    /*
     * initialValue
     */
    const {value = []} = reference.props;
    const $data = Op.yoValue(value, tableRef);
    state.initialValue = $data;
    state.data = $data;

    yiForm(reference, config, state)
        .then(__Zn.ready).then(__Zn.pipe(reference));
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
    const ref = __Zn.onReference(reference, 1);
    /*
     * executors 格式化，DialogEditor 专用
     */
    const $table = __Zn.clone(table);
    $table.columns = table.columns.filter(item => "EXECUTOR" !== item['$render']);
    state.$table = __Zn.configTable(ref, $table, {});

    __Zn.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
};
/*
 * fnComponent 的生成
 * 最终返回 Promise
 * 1）form = String：编程模式
 * 2）form = Object：直接配置模式
 * {
 *     "ui": [
 *
 *     ]
 * }
 * 3）form = Object：动态模式
 * {
 *     "code": "xxxx"
 * }
 * 直接通过函数转换成 Promise 处理
 */
const yiForm = (reference, config = {}, state = {}) => {
    const {form = {}} = config;
    /*
     * 读取 ref 引用，注：这里是 DialogEditor组件
     * 只有 ref 中可能包含需要使用的信息，包括 Ant Form 的引用绑定
     *
     */
    if ("string" === typeof form) {
        /*
         * 第一种配置：最早的原始配置，编程模式，表单组件从外置传入
         */
        const ref = __Zn.onReference(reference, 1);
        if (ref) {
            // 提取表单组件的位置
            const {$form = {}} = ref.props;
            const Component = $form[form];
            if (Component) {
                state.fnComponent = ($inited = {}, $mode) => {
                    /*
                     * 传入的是值
                     */
                    const inherit = Op.yoInheritForm(reference, $inited, $mode);
                    return (
                        <Component {...inherit}/>
                    );
                };
                return __Zn.promise(state);
            } else {
                console.error("编程模式：表单配置非法！", $form, form);
                state.error = `Component in dialog has been missed. key = ${form}`;
                return __Zn.promise(state);
            }
        } else return __Zn.promise(state);
    } else {
        if (form.hasOwnProperty("code")) {
            /*
             * 远程配置（后期处理）
             */
            return __Zn.promise(state);
        } else {
            /*
             * 当前配置，可直接处理
             * 直接将 form 作为表单专用的 object 来处理
             */
            state.fnComponent = ($inited = {}, $mode) => {
                /*
                 * 传入的是值，并且对接 config 部分
                 */
                const inherit = Op.yoInheritForm(reference, $inited, $mode);
                inherit.config = form;
                return (
                    <FormComponent {...inherit} reference={reference}/>
                );
            };
            return __Zn.promise(state);
        }
    }
}

const componentInit = (reference) => {
    const {config = {}, readOnly = false} = reference.props;
    if (readOnly) {
        yiView(reference, config);
    } else {
        yiEdition(reference, config);
    }
};
const componentUp = (reference, virtualRef) => {
    const {readOnly = false} = reference.props;
    if (!readOnly) {
        const prevValue = virtualRef.props.value;
        const curValue = reference.props.value;
        /*
         * 发生改变的时候操作
         */
        if (__Zn.isDiff(prevValue, curValue)) {
            /*
             * Form 处理
             */
            const ref = __Zn.onReference(reference, 1);
            const form = __Zn.v4FormRef(ref); // ref.props;
            /*
             * 是否操作过（未操作就是重置状态）
             */
            const isTouched = form ? form.isFieldsTouched() : false;
            if (isTouched) {

            } else {
                /*
                 * 重置表单
                 */
                const {initialValue = []} = reference.state;
                const {onChange, id} = reference.props;
                if (__Zn.isFunction(onChange)) {
                    /*
                     * 初始化表单
                     */
                    __Zn.of(reference).in({
                        data: initialValue
                    }).handle(() => {

                        if (0 < initialValue.length) {
                            /*
                             * 编辑重置
                             */
                            const state = {};
                            state[id] = initialValue;
                            __Zn.formHits(ref, state);
                        } else {
                            /*
                             * 添加重置
                             */
                            __Zn.formReset(ref, [id])
                        }
                    })
                }
            }
        }
    }
};

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        this.state = __Zn.xtInitArray(props, true);
    }

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {state: prevState, props: prevProps});
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {
                $table = {}, $dialog = {},
                $button = [],
                $visible = false,
                fnComponent = () => false,
                $inited = {},           // 初始化的值
                $mode,                  // Form的模式（同时添加和编辑）
                $submitting = false,    // 是否在提交状态
                // data = [],              // 数据源
            } = this.state;
            // Fix: valueLimit -> yoLimit
            const attrs = __Zn.yoLimit(this.props);
            const {value = []} = attrs;
            /*
             * 按钮专用处理（$dialog完善）
             */
            const ref = __Zn.onReference(this, 1);
            /*
             * 强制转换
             */
            const $value = Op.yoValue(value, $table);
            __Zn.configScroll($table, $value, ref);
            const {readOnly = false} = this.props;
            const attrUca = Sk.mixUca(UCA_NAME);
            const WebField = __Zn.V4InputGroup;
            if (readOnly) {
                return (
                    <WebField {...attrs} {...attrUca}>
                        {__Zn.aiErrorInput(this, !$visible)}
                        <Table {...$table} dataSource={$value}
                               className={"ux_table"}
                               loading={$submitting}/>
                    </WebField>
                )
            } else {
                return (
                    <WebField {...attrs} {...attrUca}>
                        {__Zn.aiErrorInput(this, !$visible)}
                        <Table {...$table} dataSource={$value}
                               className={"ux_table"}
                               loading={$submitting}/>
                        <Dialog className={"ux_dialog"}
                                size={"small"}
                                $visible={$visible}
                                $loading={$submitting}
                                $dialog={$dialog}>
                            {__Zn.isFunction(fnComponent) ?
                                fnComponent($inited, $mode) :
                                false}
                        </Dialog>
                        {__Zn.aiButtonGroup(this, $button)}
                    </WebField>
                )
            }
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component;