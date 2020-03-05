import React, {Fragment} from "react";
import Jsx from './I.common';
import U from 'underscore';
import Ut from '../../unity';

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
        if (U.isFunction(fun)) {
            const fnExecutor = (event) => {
                event.preventDefault();
                fun(text, record, {config, reference});
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

const _setEnabled = (calculated, item = {}, reference) => {
    if (calculated.edition && "fnEdit" === item.executor) {
        return true;
    } else if (calculated.deletion && "fnDelete" === item.executor) {
        return true;
    } else {
        return false;
    }
};

export default (reference, config, executor = {}) => (text, record) => {
    const {$option = []} = config;
    const options = [];
    /*
     * 执行 pluginRow
     */
    $option.forEach((item, index) => {
        // 函数过滤
        const calculated = Ut.pluginOp(reference, record);
        /*
         * 行专用的 key
         */
        const rowKey = `${text}-${index}`;
        /*
        * 追加 string 类型的 options
        * 扩展：如果 item 是 string，那么表示直接设置该属性为 true
        * _setDivider(options, item, rowKey);
        */
        {
            if (rowKey && "string" === typeof item) {
                const option = {};
                option[item] = true;
                option.key = `link-vertical-${rowKey}`;
                options.push(option);
            }
        }
        /*
         * 追加 object 类型的 options
         */
        {
            /*
            * 从 metadata中抽取想要的内容
             */
            if (rowKey && "string" !== typeof item) {
                const option = {};
                option.key = `link-${rowKey}`;
                option.text = Ut.formatExpr(item.text, record);
                // Executor 处理
                _setExecutor(option, item, {
                    text, record,
                    config,
                    executor,
                    reference,
                });
                option.enabled = _setEnabled(calculated, item, reference);
                options.push(option);
            }
        }
    });
    return (
        <Fragment>
            {options.map(item => item.divider ?
                Jsx.jsxDivider(item.key) :     // Divider 渲染
                (item.confirm ?
                        Jsx.jsxConfirm(item) : // Confirm 窗口处理
                        Jsx.jsxLink(item)      // 链接专用处理
                )
            )}
        </Fragment>
    );
}
