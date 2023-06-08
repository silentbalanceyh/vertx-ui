import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';
import React from 'react';
import __T from '../equip.fn.plugin.extension';

const Cv = __Zn.Env;

const Cmn = {
    ...__JSX,
    ...__NORM,
}


const _setExecutor = (option = {}, item, metadata = {}) => {
    const {
        executor = {},  /* 执行器函数 */
        reference,      /* 当前组件引用 */
        text,           /* Ant Design 中的 text */
        record,         /* 当前行的记录集 */
        config = {}     /* 当前字段对应的配置数据 */
    } = metadata;
    if (item.executor) {
        const fun = executor[item.executor];
        if (__Zn.isFunction(fun)) {
            const fnExecutor = (event) => {
                event.preventDefault();
                const configuration = {
                    config,     // 完整配置
                    reference,  // 引用
                };
                if (item.ajax) {
                    configuration.ajax = item.ajax;
                }
                // p 系列的方法追加到 configuration，防止和旧系统冲突
                /*
                    "$option": [
                        {
                            "text": "删除",
                            "executor": "rxDelete",
                            "confirm": "确认删除该行标签记录？",
                            "success": "恭喜，您所选择的标签记录删除成功！"
                        }
                    ],
                    "$config": {
                        "pMessage": {
                            "error": "该操作出现了异常，请联系管理员！"
                        }
                    }

                    执行操作后的数据结构：
                    {
                        "pMessage": {
                            "error": "维持不变",
                            "success": "成功消息"
                        },
                        "pMessageKey": "success"
                    }
                 */
                const parameters = {};
                {
                    const {
                        success,
                        successKey = "success"
                    } = option;
                    const globalConfig = config[Cv.K_NAME.CONFIG] ? __Zn.clone(config[Cv.K_NAME.CONFIG]) : {};
                    Object.keys(globalConfig)
                        .filter(field => field.startsWith("p"))
                        .forEach(field => parameters[field] = globalConfig[field]);
                    if (!parameters.pMessage) {
                        parameters.pMessage = {};
                    }
                    if (success) {
                        parameters.pMessageKey = successKey;
                        parameters.pMessage[successKey] = success;
                    }
                    __Zn.dgDebug(parameters, "行执行 Executor 构造参数（render = EXECUTOR）！", "#8B1C62")
                }
                configuration.parameters = parameters;
                fun(text, record, configuration);
            };
            if (item.confirm) {
                option.confirm = item.confirm;
                option.onConfirm = fnExecutor;
            } else {
                option.onClick = fnExecutor;
            }
        } else {
            option.error = "Not Function";
            console.error(option.error);
        }
    } else {
        option.error = "No Executor";
        console.error(option.error);
    }
};

const _setEnabled = (calculated, item = {}, executor = {}, options = {}) => {
    if (__Zn.isEmpty(executor)) {
        /*
         * 直接禁用
         */
        return false;
    } else {
        /*
         * 基础检查（先检查 executor 中是否包含了 item
         */
        if (executor.hasOwnProperty(item.executor)) {
            /*
             * 包含了，则执行 calculated 的判断
             */
            if ("fnEdit" === item.executor || "fnDelete" === item.executor) {
                if (calculated.edition && "fnEdit" === item.executor) {
                    /*
                     * 编辑按钮
                     */
                    const option = options['op.row.edit'];
                    if (undefined === option) {
                        return true;
                    } else {
                        return !!option;
                    }
                } else if (calculated.deletion && "fnDelete" === item.executor) {
                    /*
                     * 删除按钮
                     */
                    const option = options['op.row.delete'];
                    if (undefined === option) {
                        return true;
                    } else {
                        return !!option;
                    }
                } else return false;
            } else {
                // 新增 $executor 启用拦截
                if (calculated.hasOwnProperty(item.executor)) {
                    return calculated[item.executor];
                } else {
                    return true;
                }
            }
        } else {
            // 不包含的情况，直接 false
            return false;
        }
    }
};

const _setRule = (option, item = {}, record = {}) => {
    if (item.rule) {
        try {
            const rule = item.rule;
            const field = rule.field;
            const value = record[field];
            const replaced = rule.value[value];
            if (replaced) {
                Object.assign(option, replaced);
            }
        } catch (error) {
        }
    }
}
export default {
    EXECUTOR: (reference, column, executor = {}) => (text, record) => {
        const {$options = {}} = reference.props;
        const {$option = []} = column;
        const options = [];
        // 「显示 / 隐藏」过滤 $plugins.koRow
        __T.pluginKoRow(reference, record, $option).forEach((item, index) => {
            // 「启用 / 禁用」过滤 ￥plugins.pluginRow（和表单会绑定，ACL操作）
            const calculated = __T.pluginOp(reference, record);
            const rowKey = `${text}-${index}`;                                          // 行专用的 key
            if (rowKey) {
                const option = {};
                option.key = `link-${rowKey}`;
                option.text = __Zn.formatExpr(item.text, record);
                option.enabled = _setEnabled(
                    calculated, item,
                    executor, $options
                );
                // 新流程专用
                option.success = item.success;
                if (option.enabled) {
                    _setExecutor(option, item, {
                        text, record,
                        config: column,
                        executor,
                        reference,
                    });
                    _setRule(option, item, record);
                    options.push(option);
                } else {
                    const viewText = $options['op.row.view'];                          // fnEdit 切换，编辑被关闭
                    if ("fnEdit" === item.executor && viewText) {                      // 打开 fnEdit
                        option.enabled = true;
                        option.icon = "search";
                        option.text = viewText;
                        _setExecutor(option, item, {
                            text, record,
                            config: column,
                            executor,
                            reference,
                        });
                        options.push(option);
                    }
                }
            }
        });
        // 自动计算 divider
        let normalized = [];
        for (let idx = 0; idx < options.length; idx++) {
            const option = options[idx];
            normalized.push(option);
            if (idx < options.length - 1) {
                const item = {};
                item.divider = true;
                item.key = `link-devider-${text}-${idx}`;
                normalized.push(item);
            }
        }
        return (
            <div style={{
                width: "100%",
                textAlign: "center",
                ...(column.style ? column.style : {})
            }}>
                {0 < options.filter(item => !item.divider).length ?
                    normalized.map(item => item.divider ?
                        Cmn.jsxDivider(item.key) :                                      // Divider 渲染
                        (item.confirm ? Cmn.jsxConfirm(item) : Cmn.jsxLink(item))       // Confirm 窗口处理，链接专用处理
                    ) : false}
            </div>
        );
    }
}