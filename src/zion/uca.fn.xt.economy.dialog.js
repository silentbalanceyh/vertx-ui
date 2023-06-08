import {CheckOutlined, CloseOutlined, SearchOutlined} from '@ant-design/icons';
import {Button} from "antd";
import React from "react";
import __Zn from './zero.module.dependency';
import __OE from './uca.fn.xt.op.event';
import __LL from './uca.fn.xt.lazy.loading';
import __SP from './query.fn.qr.syntax.parser';
import __XP from './uca.__.fn.xt.process';

const __xtAddonClean = (reference) => {
    const {
        value, allowClear,
        disabled = false,
        readOnly = false
    } = reference.props;
    const attrs = {};
    attrs.type = "delete";
    attrs.style = {
        fontSize: 14
    };
    if (undefined !== value && allowClear) {
        attrs.onClick = event => {
            __Zn.prevent(event);
            // 有值才清空
            __Zn.fn(reference).onChange(undefined);
        }
    }
    if (disabled || readOnly) {
        if (attrs.onClick) {
            delete attrs.onClick;
        }
        attrs.className = "icon-ro"
    }
    const {type, ...rest} = attrs;
    return __Zn.v4Icon(type, rest);
}

const xtDialogCombine = (reference, inputAttrs = {}) => {
    const {
        onClick
    } = reference.state ? reference.state : {};
    const {
        value,
        readOnly = false,
        disabled = false
    } = reference.props;
    const inputCombine = {};
    // Remove Assist Data
    Object.keys(inputAttrs)
        .filter(field => !field.startsWith("$"))
        .forEach(field => inputCombine[field] = inputAttrs[field]);
    /*
     * 外置传入
     * readOnly = true（真实的 true）
     * readOnly = false（可编辑，但最终 inputCombine 会转换成 true）
     */
    let className;
    if (readOnly || disabled) {
        /*
         * 真正意义上的处理
         */
        delete inputCombine.onClick;
        inputCombine.suffix = (<SearchOutlined/>);
        className = "ux_readonly_unselect ux_addon_disabled";
        if (inputCombine.allowClear) {
            inputCombine.addonAfter = __xtAddonClean(reference);
            // 修正输入框
            delete inputCombine.allowClear;
        }
        inputCombine.className = className;
    } else {
        /*
         * 可用标准
         */
        inputCombine.suffix = (<SearchOutlined onClick={onClick}/>);
        className = "ux_readonly_select";
        // 非只读可使用
        if (inputCombine.allowClear) {
            inputCombine.addonAfter = __xtAddonClean(reference);
            if (undefined !== value) {
                inputCombine.className = `${className} ux_addon_after`;
            } else {
                inputCombine.className = `${className} ux_addon_disabled`;
            }
            // 修正输入框
            delete inputCombine.allowClear;
        } else {
            inputCombine.className = className;
        }
    }
    inputCombine.readOnly = true;


    return inputCombine;
}
/*
 * ListSelector,
 * MatrixSelector
 * TreeSelector
 * 三组件合并专用统一方法，用于设定 Dialog 的配置信息（全程统一）
 */
const __xtOnSeeking = (reference, config = {}, record, callback) => {
    if (config.seeking) {
        const seeking = config.seeking
        __Zn.dgDebug(seeking, "[ Ux ] 触发二次查询", "#93c")
        const params = __Zn.parseAjax(seeking.magic, reference)
        const parameters = Object.assign(params, record);
        __Zn.asyncData(seeking, parameters, callback)
    } else {
        callback(record)
    }
}
const __xtOnConfirm = (reference = {}, config = {}) => (event) => {
    __Zn.prevent(event);
    /*
     * 全部统一成 $keySet，修正 ListSelector 中的选择内容
     */
    const {$keySet} = reference.state;
    const ref = __Zn.onReference(reference, 1);
    // 判断ListSelector中的选中项，状态中的$select是否存在
    if ($keySet) {
        const callback = (result) => {
            // 执行Linker过后的回调
            const {fnCallback} = config;
            if (__Zn.isFunction(fnCallback)) {
                fnCallback(result);
            }
        }
        /*
         * Linker取值
         * 单记录选择和多记录选择的不同
         * -- 单记录选择支持 linker 功能
         * -- 多记录选择不支持 linker 功能
         */
        if (__Zn.isCollection($keySet)) {
            // 计算多选结果
            let $selectedKeys = __OE.xtChecked($keySet, reference, config);

            if (0 < $selectedKeys.length) {
                __Zn.of(reference).in({
                    $filters: undefined
                }).hide().handle(() => {

                    /* 多选后直接执行结果 */
                    __Zn.fn(reference).onChange($selectedKeys);

                    /* 回调 */
                    callback($selectedKeys);
                })
                // /* 多选后直接执行结果 */
                // __Zn.fn(reference).onChange($selectedKeys);
                //
                // /* 回调 */
                // callback($selectedKeys);
                //
                // // 关闭窗口
                // reference.?etState({$visible: false, $filters: undefined});
            } else {

                // 触发选择验证，多选过程中的无选项验证
                const validatedMessage = config.validation;
                if (validatedMessage) {
                    __Zn.messageFailure(validatedMessage);
                }
            }
        } else {
            // 单选新增linker的seeking功能，用于读写 linker 更动态
            __xtOnSeeking(reference, config, $keySet, (record) => {
                // 计算最终值
                const values = __Zn.writeLinker({}, config, () => record);
                /* 无值不触发 */
                if (!__Zn.isEmpty(values)) {
                    // 调用Form执行数据处理 Linker
                    const form = __Zn.v4FormRef(ref);// ref.props;
                    if (form) {

                        // 回调
                        callback($keySet);

                        // onChange 保证表单的 isTouched
                        const {id} = reference.props;

                        // 新版：选择数据时不修改 initialValue，该值只有重置的时候使用
                        // const {initialValue = {}} = reference.state;
                        // Object.assign(initialValue, values);
                        // reference.setState({initialValue});

                        /*
                         * Ant Form 专用流程表单用法，用于在表单中处理值信息
                         * 由于 setFieldsValue改变Form的 isTouched = false，所以在执行选择操作时
                         * 先更改 linker 中的所有值，然后调用 onChange 方法使得 isTouched = true
                         * 有了该值后才能处理 update 中的判断，所以此处的顺序必须是
                         * 1. formHits
                         * 2. onChange
                         */
                        __Zn.formHits(ref, values);

                        __Zn.fn(reference).onChange(values[id]);
                    } else {
                        // 非表单专用流程
                        __Zn.fn(reference).onChange(values);
                    }
                }
                // 此处可并行
                __Zn.of(reference).in({
                    $filters: undefined
                }).hide().done();
                // reference.?etState({$visible: false, $filters: undefined});
            })
        }
    } else {
        if (config.validation) {
            __Zn.messageFailure(config.validation);
        }
    }
};
const __xtOnClose = (reference = {}, show = false) => (event) => {
    __Zn.prevent(event);
    // 设置窗口开关事件
    let state = {};
    state.$visible = show;
    // 重置页面数据
    state.$page = 1;
    state.$filters = undefined;
    // state = __Zn.clone(state);
    __Zn.of(reference).in(state).done();
    // reference.?etState(state);
};
const xtDialogConfig = (reference, config = {}) => {
    const dialog = __Zn.aiExprWindow(config.window);
    // Footer 关闭按钮
    dialog.footer = (
        <div>
            <Button icon={<CloseOutlined/>} key={"keyCancel"}
                // Each child in a list should have a unique "key" prop
                    onClick={__xtOnClose(reference, false)}>{dialog.cancelText}</Button>
            <Button icon={<CheckOutlined/>} type={"primary"} key={"keyOk"}
                // Each child in a list should have a unique "key" prop
                    onClick={__xtOnConfirm(reference, config)}>{dialog.okText}</Button>
        </div>
    )
    dialog.onCancel = __xtOnClose(reference, false);
    return dialog;
}
const xtDialogClick = (reference, config = {}) => (event) => {
    // 常用的事件处理
    __Zn.prevent(event);

    __Zn.of(reference).in({
        // $loading: true,             // 是否在加载
        // $visible: true,             // 窗口是否显示
        $data: [],                  // 当前窗口的数据信息
        $tableKey: __Zn.randomUUID(), // 专用的表格绑定的key信息
    }).loading(false).open().handle(() => {


        /*
         * 解析 ajax 参数信息
         */
        let params = __LL.xtLazyAjax(reference, config);

        const {$filters = {}} = reference.state;
        if (!__Zn.isEmpty($filters)) {
            params = __SP.qrCombine(params, reference, $filters);
        }
        const {value} = reference.props;
        /*
         * 加载表格数据
         */
        __Zn.asyncData(config.ajax, params, ($data) => {
            const state = {$data, $loading: false};
            return __XP.xtTableLazy(reference, state, $data).then(state => {
                // selected 专用
                let $selected;
                if (config.selection && config.selection.multiple) {
                    // 多选
                    if (__Zn.isArray(value)) {
                        $selected = value;
                    }
                } else {
                    // 单选
                    if (value) {
                        // 有值
                        const {$keySet} = reference.state;
                        if ($keySet) {
                            $selected = $keySet;
                        }
                    } else {
                        // 无值
                        $selected = undefined;
                    }
                }
                state.$keySet = $selected;
                __Zn.of(reference).in(state).done();
                // reference.?etState(state);
            })
        });
    })
    // 初始化数据
    // reference.?etState({
    //     $loading: true,             // 是否在加载
    //     $visible: true,             // 窗口是否显示
    //     $data: [],                  // 当前窗口的数据信息
    //     $tableKey: __Zn.randomUUID(), // 专用的表格绑定的key信息
    // });
    //
    // /*
    //  * 解析 ajax 参数信息
    //  */
    // let params = __LL.xtLazyAjax(reference, config);
    //
    // const {$filters = {}} = reference.state;
    // if (!__Zn.isEmpty($filters)) {
    //     params = __SP.qrCombine(params, reference, $filters);
    // }
    // const {value} = reference.props;
    // /*
    //  * 加载表格数据
    //  */
    // __Zn.asyncData(config.ajax, params, ($data) => {
    //     const state = {$data, $loading: false};
    //     return __XP.xtTableLazy(reference, state, $data).then(state => {
    //         // selected 专用
    //         let $selected;
    //         if (config.selection && config.selection.multiple) {
    //             // 多选
    //             if (__Zn.isArray(value)) {
    //                 $selected = value;
    //             }
    //         } else {
    //             // 单选
    //             if (value) {
    //                 // 有值
    //                 const {$keySet} = reference.state;
    //                 if ($keySet) {
    //                     $selected = $keySet;
    //                 }
    //             } else {
    //                 // 无值
    //                 $selected = undefined;
    //             }
    //         }
    //         state.$keySet = $selected;
    //         reference.?etState(state);
    //     })
    // });
}
export default {
    xtDialogCombine,
    xtDialogConfig,
    xtDialogClick
}
