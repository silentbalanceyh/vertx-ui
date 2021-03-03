import Ux from "ux";
import {Button, Icon} from "antd";
import React from "react";
// 搜索专用配置
const searchConfig = (reference, config = {}) => {
    if (config.search) {
        const {search} = config;
        const placeholder = [];
        const condition = [];
        Object.keys(search).forEach(key => {
            placeholder.push(search[key]);
            condition.push(key);
        });
        const attrs = {};
        attrs.onSearch = (text) => {
            const $filters = {};
            if (text) {
                condition.forEach(cond => $filters[cond] = text);
                $filters[""] = false; // Or的语句
            } else {
                condition.forEach(cond => $filters[cond] = "__DELETE__");
            }
            reference.setState({$filters, $loading: true});
            Ux.toLoading(() => {
                const {onClick} = reference.state;
                if (Ux.isFunction(onClick)) {
                    onClick();
                }
            })
        };
        attrs.placeholder = placeholder.join('/');
        return attrs;
    }
}
// 表格配置
const tablePager = (reference, config = {}) => {
    const pager = {};
    if ("client" !== config.pagination) {
        pager.onChange = (pagination, filters, sorter) => {
            reference.setState({$loading: true, $visible: true});
            const {mock} = reference.props;
            if (config.ajax) {
                const params = Ux.xtLazyAjax(reference, config);
                params.pager.size = pagination.pageSize;
                params.pager.page = pagination.current;
                // 补充设置$page页面值
                Ux.asyncData(config.ajax, params, ($data) => reference.setState({
                    $loading: false, $data, $page: pagination.current
                }), mock);
            }
        };
        const {$data = {}, $page} = reference.state;
        /* 分页处理 */
        const pagination = {
            showQuickJumper: true
        };
        pagination.total = $data.count;
        pagination.size = "small";
        if (config.ajax && config.ajax.params) {
            const pager = config.ajax.params.pager;
            Ux.E.fxTerminal(!pager, 10048, pager);
            if (pager) {
                pagination.pageSize = pager.size;
                pagination.current = $page ? $page : pager.page;
            }
        }
        pager.pagination = pagination;
    } else {
        pager.pagination = true;
    }
    return pager;
};
const tableConfig = (reference, config = {}) => {
    const ref = Ux.onReference(reference, 1);
    const {table = {}} = config;
    /*
     * mountKey 针对所有记录
     */
    const mountKey = (input) => {
        /*
         * 执行内部的 Key 操作
         */
        const keyFn = (item) => {
            if (item.key) {
                item._key = item.key
            }
        }
        if (Ux.isArray(input)) {
            input.forEach(item => keyFn(item));
        } else if (Ux.isObject(input)) {
            keyFn(input);
        }
    }
    /*
     * table 中的 columns 注入
     */
    const columns = Ux.configColumn(ref, table.columns ? table.columns : []);
    const rowSelection = {}
    const {selection} = config;
    const tableAttrs = {};
    if (selection && selection.multiple) {
        /*
         * 多选
         */
        rowSelection.onChange = (keys = []) => {
            const {$data = {}} = reference.state;
            if (0 < keys.length) {
                const {list = []} = $data;
                const $keys = new Set(keys);
                const $keySet = list.filter(item => $keys.has(item.key));
                mountKey($keySet);

                reference.setState({$keySet});
            } else {
                // 反选
                reference.setState({$keySet: undefined});
            }
        }
    } else {
        /*
         * 单选
         */
        rowSelection.type = 'radio';
        rowSelection.onSelect = ($keySet) => {
            mountKey($keySet);
            reference.setState({$keySet});
        }
        tableAttrs.onRow = ($keySet = {}) => {
            return {
                onClick: event => {
                    Ux.prevent(event);
                    mountKey($keySet);
                    reference.setState({$keySet});
                }
            }
        }
    }
    tableAttrs.columns = columns;
    tableAttrs.rowSelection = rowSelection;
    return tableAttrs;
}
// 弹框配置

const _renderClean = (reference) => {
    const {value, allowClear} = reference.props;
    const attrs = {};
    attrs.type = "delete";
    attrs.style = {
        fontSize: 14
    };
    if (undefined !== value && allowClear) {
        attrs.onClick = event => {
            Ux.prevent(event);
            // 有值才清空
            Ux.fn(reference).onChange(undefined);
        }
    }
    return (<Icon {...attrs}/>)
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
    /*
     * 全部统一成 $keySet，修正 ListSelector 中的选择内容
     */
    const {$keySet} = reference.state;
    const ref = Ux.onReference(reference, 1);
    // 判断ListSelector中的选中项，状态中的$select是否存在
    if ($keySet) {
        const callback = (result) => {
            // 执行Linker过后的回调
            const {fnCallback} = config;
            if (Ux.isFunction(fnCallback)) {
                fnCallback(result);
            }
        }
        /*
         * Linker取值
         * 单记录选择和多记录选择的不同
         * -- 单记录选择支持 linker 功能
         * -- 多记录选择不支持 linker 功能
         */
        if (Ux.isCollection($keySet)) {
            // 计算多选结果
            let $selectedKeys = Ux.xtChecked($keySet, reference);

            if (0 < $selectedKeys.length) {
                /* 多选后直接执行结果 */
                Ux.fn(reference).onChange($selectedKeys);

                /* 回调 */
                callback($selectedKeys);

                // 关闭窗口
                reference.setState({$visible: false});
            } else {

                // 触发选择验证，多选过程中的无选项验证
                const validatedMessage = config.validation;
                if (validatedMessage) {
                    Ux.messageFailure(validatedMessage);
                }
            }
        } else {
            // 计算最终值
            const values = Ux.writeLinker({}, config, () => $keySet);
            /*
             * 无值不触发
             */
            if (!Ux.isEmpty(values)) {
                // 调用Form执行数据处理 Linker
                const {form} = ref.props;
                if (form) {

                    // Ant Form 专用流程表单用法，用于在表单中处理值信息
                    Ux.formHits(ref, values);

                    // 回调
                    callback($keySet);

                    // onChange 保证表单的 isTouched
                    const {id} = reference.props;
                    Ux.fn(reference).onChange(values[id]);
                } else {
                    // 非表单专用流程
                    Ux.fn(reference).onChange(values);
                }
            }
            reference.setState({$visible: false});
        }
    } else {
        if (config.validation) {
            Ux.messageFailure(config.validation);
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
                const {config = {}, value} = reference.props;
                let $selected;
                if (config.selection && config.selection.multiple) {
                    /*
                     * 多选处理
                     */
                    if (Ux.isArray(value)) {
                        $selected = value;
                    }
                } else {
                    /*
                     * 单选处理
                     */
                    if (value) {
                        /*
                         * 有值
                         */
                        const {$keySet} = reference.state;
                        if ($keySet) {
                            $selected = $keySet;
                        }
                    } else {
                        /*
                         * 单选无值
                         */
                        $selected = undefined;
                    }
                }
                state.$keySet = $selected;
                reference.setState(state);
            })
        } else {
            console.error("表格配置异常: ", table);
        }
    });
}
export default {
    Limit: {
        TreeList: {
            Form: [
                "$formAdd",
                "$formEdit",
                "$formFilter",
                "$list",
                "$query",
                "$mockData",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
                "rxAddRow",
                "$tree",
                "$formTreeAdd",
                "$formTreeEdit",
                "rxItemDelete",
                "rxTree",
                "rxItemAdd",
                "rxItemEdit",
                // 新添加的属性
                "rxParamTree",
                "$content",
                "$root"
            ]
        },
        TabList: {
            // ComplexList中搜索框需要过滤的属性
            Filter: [
                "$formAdd",
                "$formEdit",
                "$mockData",
                "$formFilter",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
                "rxAddRow",
                "$list",
                "$tree",
                "$formTreeAdd",
                "$formTreeEdit",
                "rxItemDelete",
                "rxTree",
                "rxItemAdd",
                "rxItemEdit"
            ],
            Add: [
                "$formAdd",
                "$formEdit",
                "$formFilter",
                "$list",
                "$query",
                "$mockData",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
                "rxAddRow",
                "$tree",
                "$formTreeAdd",
                "$formTreeEdit",
                "rxItemDelete",
                "rxTree",
                "rxItemAdd",
                "rxItemEdit"
            ],
            Edit: [
                "$formAdd",
                "$formEdit",
                "$formFilter",
                "$list",
                "$mockData",
                "$query",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
                "rxAddRow",
                "$tree",
                "$formTreeAdd",
                "$formTreeEdit",
                "rxItemDelete",
                "rxTree",
                "rxItemAdd",
                "rxItemEdit"
            ]
        },
        ComplexList: {
            // ComplexList中搜索框需要过滤的属性
            Filter: [
                "$formAdd",
                "$formEdit",
                "$mockData",
                "$formFilter",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
                "$list"
            ],
            Add: [
                "$formAdd",
                "$formEdit",
                "$formFilter",
                "$list",
                "$query",
                "$mockData",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
            ],
            Edit: [
                "$formAdd",
                "$formEdit",
                "$formFilter",
                "$list",
                "$mockData",
                "$query",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
            ]
        },
        DialogList: {
            Shared: [
                "$formAdd",
                "$formEdit",
                "fnView",
                "fnMock",
                "rxDelete"
            ]
        },
        DialogMenu: {
            Filter: [
                "$disabled",
                "$disabledItems",
                "$inited",
                "$items",
                "$button",
                "$functions",
                "$content",
                "$mode"
            ]
        },
        DialogButton: {
            Filter: [
                "$disabled",
                "$button",
                "$dialog",
                "$mode",
                "$inited",
                "$content",
            ]
        }
    },
    // 专用于弹出框
    searchConfig,   // 搜索框专用
    tablePager,
    tableConfig,
    dialogCombine,
    dialogConfig,
    dialogClick
};