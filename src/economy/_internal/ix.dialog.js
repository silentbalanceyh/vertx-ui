import {Button, Icon} from "antd";
import React from "react";
import Ux from "ux";
import U from "underscore";

const _renderClean = (reference) => {
    const {value} = reference.props;
    const attrs = {};
    attrs.type = "delete";
    attrs.style = {
        fontSize: 14
    };
    if (undefined !== value) {
        attrs.onClick = event => {
            Ux.prevent(event);
            const {config = {}, id} = reference.props;
            // 有值才清空
            if (value) {
                const values = Ux.writeLinker({}, config);
                // 表单专用处理
                const ref = Ux.onReference(reference, 1);
                const {form} = ref.props;
                if (form) {
                    if (Ux.isEmpty(values) && id) {
                        values[id] = undefined;
                    }
                    Ux.formHits(ref, values);
                }
            }
        }
    }
    return (
        <Icon {...attrs}/>
    )
}

const dialogCombine = (reference, inputAttrs = {}) => {
    const {
        onClick
    } = reference.state ? reference.state : {};
    const {value} = reference.props;
    const inputCombine = {};
    inputCombine.suffix = (<Icon type="search" onClick={onClick}/>);
    inputCombine.readOnly = true;
    Object.assign(inputCombine, inputAttrs);
    if (inputCombine.allowClear) {
        inputCombine.addonAfter = _renderClean(reference);
        if (undefined !== value) {
            inputCombine.className = "ux-readonly ux-addon-after";
        } else {
            inputCombine.className = "ux-readonly ux-addon-disabled";
        }
    } else {
        inputCombine.className = "ux-readonly";
    }
    return inputCombine;
}
/*
 * ListSelector,
 * MatrixSelector
 * TreeSelector
 * 三组件合并专用统一方法，用于设定 Dialog 的配置信息（全程统一）
 */

const _onConfirm = (reference = {}, config = {}) => (event) => {
    Ux.prevent(event);
    const {config = {}} = reference.props;
    /*
     * 全部统一成 $keySet，修正 ListSelector 中的选择内容
     */
    const {$keySet} = reference.state;
    const ref = Ux.onReference(reference, 1);
    // 判断ListSelector中的选中项，状态中的$select是否存在
    if ($keySet) {
        /*
         * Linker取值
         * 单记录选择和多记录选择的不同
         * -- 单记录选择支持 linker 功能
         * -- 多记录选择不支持 linker 功能
         */
        if (Set.prototype.isPrototypeOf($keySet) || Ux.isArray($keySet)) {

            /*
             * 多选最终结果，$keySet 为多选的 key 集合
             */
            let $selectedKeys = [];
            if (Set.prototype.isPrototypeOf($keySet)) {
                /*
                 * Tree 专用
                 */
                $selectedKeys = Array.from($keySet);
            } else {
                /*
                 * Array 专用
                 */
                $selectedKeys = $keySet;
            }
            if (0 < $selectedKeys.length) {
                Ux.fn(reference).onChange($selectedKeys);
            } else {

                /*
                 * 多选过程中的无选项验证
                 */
                const validatedMessage = config.validation;
                if (validatedMessage) {
                    Ux.messageFailure(validatedMessage);
                }
            }
        } else {
            /*
             * 单选支持 Linker 操作
             */
            const values = Ux.writeLinker({}, config, () => $keySet);
            /*
             * 无值不触发
             */
            if (!Ux.isEmpty(values)) {
                // 调用Form执行数据处理 Linker
                const {form} = ref.props;
                if (form) {
                    /*
                     * Ant Form 专用流程
                     * 表单用法，用于在表单中处理值信息
                     */
                    Ux.formHits(ref, values);

                    // 执行Linker过后的回调
                    const {fnCallback} = config;
                    if (U.isFunction(fnCallback)) {
                        fnCallback($keySet);
                    }

                    // onChange 保证表单的 isTouched
                    const {onChange, id} = reference.props;
                    if (U.isFunction(onChange)) {
                        const changeValue = values[id];
                        onChange(changeValue);
                    }
                } else {
                    /*
                     * 非表单专用流程
                     */
                    Ux.fn(reference).onChange(values);
                }
            }
        }
        // 关闭窗口
        reference.setState({$visible: false});
    } else {
        // 未选中时若包含了验证，则提示验证信息
        Ux.E.fxTerminal(!config.validation, 10080, config.validation);
        if (config.validation) {
            // TODO: showError 后期重写
            Ux.messageFailure(config.validation);
            // Dialog.showError(ref, config.validation);
        }
    }
};
const _onClose = (reference = {}, show = false) => (event) => {
    Ux.prevent(event);
    // 设置窗口开关事件
    let state = {};
    state.$visible = show;
    // 重置页面数据
    state.$page = 1;
    state = Ux.clone(state);
    reference.setState(state);
};
const dialogConfig = (reference, config = {}) => {
    const dialog = Ux.aiExprWindow(config.window);
    // Footer 关闭按钮
    dialog.footer = (
        <div>
            <Button icon="close" shape={"circle"}
                    onClick={_onClose(reference, false)}>{dialog.cancelText}</Button>
            <Button icon="check" shape={"circle"} type={"primary"}
                    onClick={_onConfirm(reference, config)}>{dialog.okText}</Button>
        </div>
    )
    dialog.onCancel = _onClose(reference, false);
    return dialog;
}
const dialogClick = (reference, config = {}) => (event) => {
    // 常用的事件处理
    Ux.prevent(event);

    // 初始化数据
    reference.setState({
        $loading: true,             // 是否在加载
        $visible: true,             // 窗口是否显示
        $data: [],                  // 当前窗口的数据信息
        $tableKey: Ux.randomUUID(), // 专用的表格绑定的key信息
        $keySet: undefined,         // 在窗口中的选中项
    });

    /*
     * 解析 ajax 参数信息
     */
    let params = Ux.xtLazyAjax(reference, config);

    const {$filters = {}} = reference.state;
    if (!Ux.isEmpty($filters)) {
        params = Ux.qrCombine(params, reference, $filters);
    }
    /*
     * 加载表格数据
     */
    Ux.asyncData(config.ajax, params, ($data) => {
        const state = {$data, $loading: false};

        const {table} = reference.state;
        if (table && table.columns) {
            return new Promise((resolve) => {

                /*
                 * lazyColumn 执行
                 */
                const lazyColumn = table.columns
                    .filter(item => "USER" === item['$render']);
                if (0 < lazyColumn.length) {

                    /*
                     * 加载更多的 lazyColumn 部分
                     */
                    Ux.ajaxEager(reference, lazyColumn, $data ? $data.list : [])
                        .then($lazy => Ux.promise(state, "$lazy", $lazy))
                        .then(done => resolve(done));
                } else {
                    /*
                     * 不带任何 lazyColumn
                     */
                    resolve(state)
                }
            }).then(state => {
                /*
                 * selected 专用
                 */
                const {config = {}} = reference.props;
                let $keySet;
                if (config.selection && config.selection.multiple) {
                    /*
                     * 多选处理
                     */
                    const {value} = reference.props;
                    if (Ux.isArray(value)) {
                        $keySet = value;
                    }
                } else {
                    /*
                     * 单选
                     */
                    const {initialRecord} = reference.state;
                    if (initialRecord) {
                        $keySet = initialRecord;
                    }
                }
                state.$keySet = $keySet;
                reference.setState(state);
            })
        } else {
            console.error("表格配置异常: ", table);
        }
    });
}
export default {
    dialogCombine,
    dialogConfig,
    dialogClick
};