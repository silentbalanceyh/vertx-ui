import React from 'react';
import './Cab.less';
import U from 'underscore';
import Op from './op/Op';
import Ux from 'ux';

import DialogButton from '../../op/DialogButton/UI';
import DialogMenu from '../../op/DialogMenu/UI';

const _calcDoller = (config = {}) => {
    const $config = {};
    Object.keys(config).forEach(key => $config[`$${key}`] = config[key]);
    return $config;
};

const _calcRender = (reference, config = {}, title = false) => {
    config = Ux.clone(config);
    // 计算Component
    const Component = config.hasOwnProperty("items") ?
        DialogMenu : DialogButton;
    const isMenu = config.hasOwnProperty("items");
    // 抽取components和functions
    const configuration = _calcDoller(config);
    return (column, record) => {
        if (Ux.isEmpty(configuration)) {
            return false;
        } else {
            // 1.计算record数据
            const $inited = _calcRecord(reference, column, record, title);
            const {$functions, $components = {}} = reference.props;
            if (isMenu) {
                return (<Component
                    key={$inited.key}
                    $inited={$inited}
                    $parent={Ux.clone(reference.props.$inited)}
                    $functions={$functions}
                    $components={$components}
                    {...configuration}/>);
            } else {
                const componentKey = config.component;
                const Child = $components[componentKey];
                return (
                    <Component key={$inited.key}
                               $inited={$inited}
                               {...configuration}>
                        <Child $inited={$inited}
                               $header={title}
                               $parent={Ux.clone(reference.props.$inited)}/>
                    </Component>
                );
            }
        }
    };
};

const _calcRecord = (reference, column, record = {}) => {
    const _addon = Op.prepareRecord(reference, column, record);
    const data = {};
    // 处理数据信息
    const levelPrefix = String(column.level);

    Object.keys(record).map(key => String(key))
        .filter(key => key.startsWith(levelPrefix))
        .forEach(key => {
            const reg = new RegExp(`${levelPrefix}.`, "g");
            const field = key.replace(reg, "");
            data[field] = record[key];
        });
    // 处理当前数据中的附加数据
    data[`_extra`] = _addon;
    const {rxRecord = data => data} = reference.props;
    return rxRecord(data, column);
};

const initOperations = (reference) => {
    const operations = {};
    const ops = Op.readOperations(reference);
    if (ops && U.isObject(ops)) {
        Object.keys(ops).filter(key => !!ops[key])
            .filter(key => ops[key].hasOwnProperty('value'))
            .forEach(key => {
                const config = ops[key];
                // 统一计算Empty和Value
                const emptyRender = _calcRender(reference, config.empty);
                const valueRender = _calcRender(reference, config.value);
                operations[key] = {};
                operations[key].empty = emptyRender;
                operations[key].value = valueRender;
                // 顶层Title对应的Render
                if (config.hasOwnProperty("title")) {
                    const $title = Ux.clone(config.title);
                    operations[key].title = _calcRender(reference, $title, true);
                }
            });
    }
    return operations;
};

const renderOp = (reference, record, {
    text, rowSpan, column
}) => {
    const {operations = {}} = reference.state;
    const jsx = {};
    jsx.props = {
        rowSpan
    };
    const render = operations[column.dataIndex];
    if (render) {
        if (0 < rowSpan) {
            let literal = text;
            if (literal && column['$expr']) {
                literal = Ux.formatExpr(column['$expr'], record);
            }
            jsx.children = (
                <span className={"web-table-cell"}
                      key={`${column.dataIndex}${record.key}`}>
                    <span className={"left"}>
                        {literal}
                    </span>
                    <span className={"right"}>
                        {text ? render.value(column, record) : render.empty(column, record)}
                    </span>
                </span>
            );
        } else {
            jsx.children = text ? text : false;
        }
    } else {
        jsx.children = text ? text : false;
    }
    return jsx;
};
const renderTitle = (reference, column = {}, fnRender) => {
    // 只添加一次的限制，直接读取第一条数据专用信息
    const title = column.title;
    return U.isFunction(column.title) ? column.title : () => (
        <span className={"web-table-cell"}>
            <span className={"left"}>
                {title}
            </span>
            <span className={"right"}>
                {fnRender(column, {})}
            </span>
        </span>
    );
};
export default {
    renderOp,
    initOperations,
    renderTitle
};