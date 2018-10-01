import React from 'react'
import './Cab.less';
import U from 'underscore';
import Op from './Op';
import Ux from 'ux';

import DialogButton from '../../op/DialogButton/UI';
import DialogMenu from '../../op/DialogMenu/UI';

const _calcDoller = (config = {}) => {
    const $config = {};
    Object.keys(config).forEach(key => $config[`$${key}`] = config[key]);
    return $config;
};

const _calcRender = (reference, config = {}) => {
    // 计算Component
    const Component = config.hasOwnProperty("items") ?
        DialogMenu : DialogButton;
    const isMenu = config.hasOwnProperty("items");
    // 抽取components和functions
    const configuration = _calcDoller(config);
    return (column, record) => {
        // 1.计算record数据
        const $inited = _calcRecord(reference, column, record);
        const {$functions, $components = {}} = reference.props;
        if (isMenu) {
            return (<Component $inited={$inited}
                               $parent={Ux.clone(reference.props.$inited)}
                               $functions={$functions}
                               $components={$components}
                               {...configuration}/>)
        } else {
            const componentKey = config.component;
            const Child = $components[componentKey];
            return (
                <Component $inited={$inited}
                           {...configuration}>
                    <Child $inited={$inited}
                           $parent={Ux.clone(reference.props.$inited)}/>
                </Component>
            )
        }
    };
};

const _calcRecord = (reference, column, record = {}) => {
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
    const _addon = {};
    const level = column.level - 1;
    _addon.parentId = record[`${level}.key`];
    // 读取垂直数据
    const options = Op.readOptions(reference);
    if (options.hasOwnProperty("extra.data.keys")) {
        const {current} = reference.state;
        if (0 < current.length) {
            const fields = Ux.arrayConnect(options["extra.data.keys"], (item) => ({
                field: item, dataKey: `${level}.${item}`
            }));
            fields.forEach(item =>
                _addon[item.field] = current.map(each => each[item.dataKey]))
        }
    }
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
                    operations[key].title = _calcRender(reference, config.title);
                }
            })
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
            jsx.children = (
                <span className={"web-table-cell"}>
                    <span className={"left"}>
                        {text}
                    </span>
                    <span className={"right"}>
                        {text ? render.value(column, record) : render.empty(column, record)}
                    </span>
                </span>
            )
        }
    } else {
        jsx.children = text;
    }
    return jsx;
};
const renderTitle = (column = {}, fnRender) => {
    return (
        <span className={"web-table-cell"}>
            <span className={"left"}>
                {column.title}
            </span>
            <span className={"right"}>
                {fnRender(column, {})}
            </span>
        </span>
    )
};
export default {
    renderOp,
    initOperations,
    renderTitle
}