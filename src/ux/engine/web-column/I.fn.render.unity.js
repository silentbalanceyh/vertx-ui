import React, {Fragment} from "react";
import {Divider, Popconfirm} from "antd";
import U from 'underscore';
import Ut from '../../unity';
/*
 * 设置 divider
 */
const _setDivider = (options = [], item, rowKey) => {
    /*
     * 扩展：如果 item 是 string，那么表示直接设置该属性为 true
     */
    if (rowKey && "string" === typeof item) {
        const option = {};
        option[item] = true;
        option.key = `link-vertical-${rowKey}`;
        options.push(option);
    }
};
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
const _setExecutors = (options = [], item, rowKey, metadata = {}) => {
    /*
     * 从 metadata中抽取想要的内容
     */
    if (rowKey && "string" !== typeof item) {
        const option = {};
        option.key = `link-${rowKey}`;
        const {record = {}} = metadata;
        option.text = Ut.formatExpr(item.text, record);
        // Executor 处理
        _setExecutor(option, item, metadata);
        options.push(option);
    }
};
const _jsxDivider = (key) => (<Divider type="vertical" key={key}/>);
const _jsxLink = (item = {}) => (
    <a key={item.key} onClick={item.onClick}>
        {item.text}
    </a>
);
const _jsxConfirm = (item = {}) => (
    <Popconfirm key={item.key} title={item.confirm}
                onConfirm={item.onConfirm}>
        <a>{item.text}</a>
    </Popconfirm>
);

export default (reference, config, executor = {}) => (text, record) => {
    const {$option = []} = config;
    const options = [];
    $option.forEach((item, index) => {
        /*
         * 行专用的 key
         */
        const rowKey = `${text}-${index}`;
        /*
         * 追加 string 类型的 options
         */
        _setDivider(options, item, rowKey);
        /*
         * 追加 object 类型的 options
         */
        _setExecutors(options, item, rowKey, {
            text, record,
            config,
            executor,
            reference,
        });
    });
    return (
        <Fragment>
            {options.map(item => item.divider ?
                _jsxDivider(item.key) :     // Divider 渲染
                (item.confirm ?
                        _jsxConfirm(item) : // Confirm 窗口处理
                        _jsxLink(item)      // 链接专用处理
                )
            )}
        </Fragment>
    );
}