import React from 'react'
import './Cab.less';
import U from 'underscore';
import Op from './Op';

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
        if (isMenu) {
            const {$functions, $components} = reference.props;
            return (<Component $inited={$inited}
                               $functions={$functions}
                               $components={$components}
                               {...configuration}/>)
        } else {
            return (
                <Component $inited={$inited}
                           {...configuration}>
                    Hello
                </Component>
            )
        }
    };
};

const _calcRecord = (reference, column, record = {}) => {
    // 处理数据信息
    const levelPrefix = String(column.level);
    const data = {};
    Object.keys(record).map(key => String(key))
        .filter(key => key.startsWith(levelPrefix))
        .forEach(key => {
            const reg = new RegExp(`${levelPrefix}.`, "g");
            const field = key.replace(reg, "");
            data[field] = record[key];
        });
    const {rxRecord = data => data} = reference.props;
    return rxRecord(data);
};

const initOperations = (reference) => {
    const operations = {};
    const ops = Op.readOperations(reference);
    if (ops && U.isObject(ops)) {
        Object.keys(ops).filter(key => !!ops[key])
            .filter(key => ops[key].hasOwnProperty('value'))
            .forEach(key => {
                const config = ops[key];
                // 统一计算
                const emptyRender = _calcRender(reference, config.empty);
                const valueRender = _calcRender(reference, config.value);
                operations[key] = {};
                operations[key].empty = emptyRender;
                operations[key].value = valueRender;
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
export default {
    renderOp,
    initOperations
}