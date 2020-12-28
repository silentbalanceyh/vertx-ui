import T from "./I.common";
import Ut from "../../unity";
import {Button, Checkbox, Col, Row} from "antd";
import Fn from "../functions";
import React from "react";
import Cfg from '../config';


const _onChange = (reference, field, setSelectedKeys) => (searchText) => {
    setSelectedKeys(searchText);
};

const onClear = (reference, field, clearFilters) => (event) => {
    event.preventDefault();
    clearFilters();
    const $condition = T.getCondition(reference, field, []);
    reference.setState({
        $condition,
        $resetCond: Ut.randomString(8),
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
    // width 执行
    let styleWidth = 0;
    options.forEach(option => {
        const optionWidth = Cfg.widthWord(option.label, true);
        if (optionWidth > styleWidth) {
            styleWidth = optionWidth;
        }
    })
    return (
        <div style={{padding: 8}}>
            <Checkbox.Group onChange={_onChange(reference, field, setSelectedKeys)}
                            style={{
                                width: width.radio ? width.radio : styleWidth,
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
                <Button onClick={_onConfirm(reference, field, selectedKeys, {confirm})}
                        className={"ux-red"}>
                    {button['yes'] ? button['yes'] : false}
                </Button>
                &nbsp;&nbsp;
                <Button {...clearAttrs}>
                    {button.reset ? button.reset : false}
                </Button>
                {Fn.anchorColumn(field, clearFilters)}
            </div>
        </div>
    );
};

export default (reference, options = [], attached = {}) => {
    const {column, config} = attached;
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
}