import Highlighter from "react-highlight-words";
import React from "react";
import {Button, Input} from "antd";
import T from './Ux.Filter.Util';
import Value from "../Ux.Value";
import Util from '../util';
import U from 'underscore';

const _getKeyWord = (reference, field, keyword = "") => {
    // 搜索文字
    let {$keyword = {}} = reference.state ? reference.state : {};
    $keyword[field] = keyword;
    $keyword = Value.clone($keyword);
    return $keyword;
};

const _onChange = (reference, field, setSelectedKeys) => (event) => {
    const highlight = event.target.value;
    const searchText = highlight ? [highlight] : [];
    setSelectedKeys(searchText);
    // 设置高亮
    const $keyword = _getKeyWord(reference, field, highlight);
    // 修改 $condition，这个时候不会导致触发
    reference.setState({$keyword});
};

const onClear = (reference, field, clearFilters) => (event) => {
    if (event && U.isFunction(event.preventDefault)) {
        event.preventDefault();
    }
    clearFilters();// 设置高亮
    const $keyword = _getKeyWord(reference, field, "");
    const $condition = T.getCondition(reference, field, []);
    reference.setState({
        $keyword, $condition,
        $resetCond: Util.randomString(8)
    });
};

const _onConfirm = (reference, field, selectedKeys, {
    confirm,
    clearFilters
}) => () => {
    confirm();
    // 空值直接触发重置
    if (0 === selectedKeys.length) {
        onClear(reference, field, clearFilters)();
    } else {
        /* 设置条件 $condition 信息 */
        const $condition = T.getCondition(reference, field, selectedKeys);
        reference.setState({$condition});
    }
};

const _filterDropdown = (field, config = {}, reference = {}) => (filterConfig = {}) => {
    const {placeholder = "", button = {}} = config;
    const {setSelectedKeys, selectedKeys = [], confirm, clearFilters} = filterConfig;
    const clearAttrs = T.getClearAttrs(reference, field, {
        selectedKeys, clearFilters, onClear,
    });
    return (
        <div style={{padding: 8}}>
            <Input placeholder={placeholder}
                   value={selectedKeys[0]}
                   onChange={_onChange(reference, field, setSelectedKeys)}
                   onPressEnter={_onConfirm(reference, field, selectedKeys, {
                       confirm, clearFilters
                   })}
                   style={{width: 188, marginBottom: 8, display: 'block'}}
            />
            <Button type="primary" icon="search" className={"ux-red"}
                    onClick={_onConfirm(reference, field, selectedKeys, {
                        confirm, clearFilters
                    })}
                    style={{width: 90, marginRight: 8}}>
                {button.search ? button.search : false}
            </Button>
            <Button {...clearAttrs}
                    style={{width: 90}}>
                {button.reset ? button.reset : false}
            </Button>
            {T.jsxArchor(field, clearFilters)}
        </div>
    );
};

const _mountHighlight = (column = {}, reference) => {
    // 这种情况下需要重写 render
    column.render = (text) => {
        const {$keyword = {}} = reference.state ? reference.state : {};
        const words = Object.keys($keyword)
            .filter(cond => cond.startsWith(column.dataIndex))
            .map(cond => $keyword[cond]);
        return (
            <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={words}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
            />
        );
    };
};
export default (reference, column, config) => {
    // filterIcon
    column.filterIcon = T.getFilterIcon(reference, column.dataIndex, "search");
    // filterDropdown
    column.filterDropdown = _filterDropdown(column.dataIndex, config, reference);
    // filteredValue
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
    // 重写render
    _mountHighlight(column, reference);
};