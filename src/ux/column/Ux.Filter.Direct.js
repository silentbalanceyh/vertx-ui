import Value from "../Ux.Value";
import Ai from "../ai/AI";
import T from './Ux.Filter.Util';
import {Checkbox, Col, Row} from "antd";
import Util from '../util';
import React from "react";

const _onChange = (reference, field, setSelectedKeys) => (searchText) => {
    setSelectedKeys(searchText);
};

const onClear = (reference, field, clearFilters) => (event) => {
    event.preventDefault();
    clearFilters();
    const $condition = T.getCondition(reference, field, []);
    reference.setState({
        $condition,
        $resetCond: Util.randomString(8),
    });
};

const _onConfirm = (reference, field, selectedKeys, {
    confirm,
}) => (event) => {
    event.preventDefault();
    confirm();
    const $condition = T.getCondition(reference, field, selectedKeys);
    reference.setState({
        $condition,
    });
};

const _filterDropdown = (field, config = {}, reference = {}) => (filterConfig = {}) => {
    const {button = {}, options = [], width = {}} = config;
    const {setSelectedKeys, selectedKeys = [], confirm, clearFilters} = filterConfig;
    const clearAttrs = T.getClearAttrs(reference, field, {
        selectedKeys, clearFilters, onClear,
    });
    return (
        <div style={{padding: 8}}>
            <Checkbox.Group onChange={_onChange(reference, field, setSelectedKeys)}
                            style={{
                                width: width.radio ? width.radio : 90,
                                marginBottom: 8, display: "block"
                            }}
                            value={selectedKeys}
            >
                {options.map(option => (
                    <Row key={option.value} style={{marginBottom: 8}}>
                        <Col span={24}>
                            <Checkbox value={option.value}>{option.label}</Checkbox>
                        </Col>
                    </Row>
                ))}
            </Checkbox.Group>
            <div style={{textAlign: "center", width: "100%"}}>
                <a onClick={_onConfirm(reference, field, selectedKeys, {confirm})}
                   style={{width: width.button ? width.button : 48, marginRight: 8}}>
                    {button['yes'] ? button['yes'] : false}
                </a>
                <a {...clearAttrs}
                   style={{width: width.button ? width.button : 48}}>
                    {button.reset ? button.reset : false}
                </a>
                {T.jsxArchor(field, clearAttrs.onClick)}
            </div>
        </div>
    );
};

export default (reference, column, config) => {
    // 下拉处理
    const options = [];
    if (!Value.isEmpty(config)) {
        // 直接解析 datum
        // 也会得到 key, label, value
        const datum = Ai.RxAnt.toOptions(reference, config);
        datum.forEach(each => options.push({
            label: each.label,
            value: each.value
        }));
        // filterIcon
        column.filterIcon = T.getFilterIcon(reference, column.dataIndex, "filter");
        // filterDropdown
        column.filterDropdown = _filterDropdown(column.dataIndex, {
            ...config, options
        }, reference);
        /**
         * 自定义处理中设置当前查询条件的值，最好的办法是为空时不可控，
         * 配合 pagination, sorter, filters
         * 的操作，如果设置了
         * column.filteredValue = []，会导致当前字段没有查询条件的时候
         * onChange = (pagination, filters, sorter) 中的参数
         * filters = { <name>:[] } 这种格式，这种格式是不对，不可以如此操作，
         * 如果当前字段没有设置查询条件，应该是：filters = {} 的模式
         */
        const filteredValue = T.getFilteredValue(reference, column);
        if (0 < filteredValue.length) {
            column.filteredValue = filteredValue;
        } else {
            if (column.filteredValue) delete column.filteredValue;
        }
    } else {
        console.error(`[Err] type = DIRECT 的模式要求必须配置 config，没配置 config 节点`);
    }
};