import Value from '../Ux.Value';
import Ai from '../ai/AI';
import React from 'react';
import {Button, Icon, Input} from 'antd';
import Highlighter from 'react-highlight-words';

const _setKeyword = (reference, field, keyword = "") => {
    // 搜索文字
    let {$keyword = {}} = reference.state;
    $keyword[field] = keyword;
    $keyword = Value.clone($keyword);
    reference.setState({$keyword});
};

const _onChange = (reference, field, setSelectedKeys) => (event) => {
    const highlight = event.target.value;
    const searchText = highlight ? [highlight] : [];
    setSelectedKeys(searchText);
    // 设置高亮
    _setKeyword(reference, field, highlight);
};

const _onClear = (reference, field, clearFilters) => (event) => {
    event.preventDefault();
    clearFilters();
    _setKeyword(reference, field, "");
};

const _filterDropdown = (field, config = {}, reference = {}) => (filterConfig = {}) => {
    const {placeholder = "", button = {}} = config;
    const {setSelectedKeys, selectedKeys, confirm, clearFilters} = filterConfig;
    return (
        <div style={{padding: 8}}>
            <Input placeholder={placeholder}
                   value={selectedKeys[0]}
                   onChange={_onChange(reference, field, setSelectedKeys)}
                   onPressEnter={() => confirm()}
                   style={{width: 188, marginBottom: 8, display: 'block'}}
            />
            <Button type="primary" icon="search" className={"ux-red"}
                    onClick={() => confirm()}
                    style={{width: 90, marginRight: 8}}>
                {button.search ? button.search : false}
            </Button>
            <Button onClick={_onClear(reference, field, clearFilters)}
                    style={{width: 90}}>
                {button.reset ? button.reset : false}
            </Button>
        </div>
    );
};

const _filterIcon = (filtered) => (
    <Icon type={"search"} style={{color: filtered ? '#1890ff' : undefined}}/>);

const _mountHighlight = (column = {}, reference) => {
    // 这种情况下需要重写 render
    column.render = (text) => {
        const {$keyword = {}} = reference.state;
        const words = Object.keys($keyword)
            .filter(cond => cond.startsWith(column.dataIndex))
            .map(cond => $keyword[cond]);
        return (
            <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={words}
                autoEscape
                textToHighlight={text.toString()}
            />
        );
    };
};

const columnFilter = (column = {}, reference = {}) => {
    if (column.hasOwnProperty("$filter")) {
        const {$filter = {}} = column;
        const {config = {}, type = "DIRECT"} = $filter;
        // 直接解析
        if ("DIRECT" === type) {
            // 下拉处理
            const options = [];
            if (!Value.isEmpty(config)) {
                // 直接解析 datum
                // 也会得到 key, label, value
                const datum = Ai.RxAnt.toOptions(reference, config);
                datum.forEach(each => options.push({
                    text: each.label,
                    value: each.value
                }));
                column.filters = options;
            } else {
                console.error(`[Err] type = ${type} 的模式要求必须配置 config，没配置 config 节点`);
            }
        } else if ("SEARCH" === type) {
            // 设置特殊属性
            // filterIcon
            column.filterIcon = _filterIcon;
            // filterDropdown
            column.filterDropdown = _filterDropdown(column.dataIndex, config, reference);
            // 重写render
            _mountHighlight(column, reference);
        } else {
            console.error(`[Err] type = ${type} 的模式目前不支持！`);
        }
    }
};
export default {
    columnFilter
};