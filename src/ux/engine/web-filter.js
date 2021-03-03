import Abs from "../abyss";
import Ut from "../unity";
import {Button, Checkbox, Col, Icon, Input, Row} from "antd";
import Fn from "./functions";
import React from "react";
import R from "./expression";
import Cfg from "./config";
// =====================================================
// 工具函数
// =====================================================
const getCondition = (reference, field, values = []) => {
    let {$condition = {}} = reference.state ? reference.state : {};
    $condition = Abs.clone($condition);
    $condition[field] = values;
    return $condition;
};
const isFiltered = (reference, field) => {
    const {$condition = {}} = reference.state ? reference.state : {};
    let filtered = false;
    if ($condition.hasOwnProperty(field)) {
        const value = $condition[field];
        if (Abs.isArray(value)) {
            filtered = (0 < value.length);
        }
    }
    return filtered;
};

const getFilteredValue = (reference, column) => {
    const {$condition = {}} = reference.state ? reference.state : {};
    if ($condition.hasOwnProperty(column.dataIndex)) {
        return $condition[column.dataIndex];
    } else {
        return [];
    }
};
const getFilterIcon = (reference, field, type) => () => {
    const attrs = {};
    if (isFiltered(reference, field)) {
        attrs.style = {color: "#1890ff"};
    } else {
        attrs.style = {};
    }
    return (
        <Icon type={type}
              {...attrs}/>
    );
};
const getClearAttrs = (reference, field, {
    clearFilters, selectedKeys = [], onClear
}) => {
    const clearAttrs = {};
    if (0 === selectedKeys.length) {
        clearAttrs.disabled = true;
    } else {
        clearAttrs.onClick = onClear(reference, field, clearFilters);
    }
    return clearAttrs;
};

// =====================================================
// 通用下拉
// =====================================================
const _filterDropdownCommon = (field, config = {}, reference = {}) => (filterConfig = {}) => {
    const {button = {}, options = [], width = {}} = config;
    const {setSelectedKeys, selectedKeys = [], confirm, clearFilters} = filterConfig;
    const clearAttrs = getClearAttrs(reference, field, {
        selectedKeys, clearFilters, onClear: (event) => {
            event.preventDefault();
            clearFilters();
            const $condition = getCondition(reference, field, []);
            reference.setState({
                $condition,
                $resetCond: Ut.randomString(8),
            });
        },
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
            <Checkbox.Group onChange={(searchText) => setSelectedKeys(searchText)}
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
                <Button onClick={(event) => {
                    event.preventDefault();
                    confirm();
                    const $condition = getCondition(reference, field, selectedKeys);
                    reference.setState({
                        $condition,
                    });
                }}
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

const mountDropdown = (reference, options = [], attached = {}) => {
    const {column, config} = attached;
    // filterIcon
    column.filterIcon = getFilterIcon(reference, column.dataIndex, "filter");
    // filterDropdown
    column.filterDropdown = _filterDropdownCommon(column.dataIndex, {
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
    const filteredValue = getFilteredValue(reference, column);
    if (0 < filteredValue.length) {
        column.filteredValue = filteredValue;
    } else {
        if (column.filteredValue) delete column.filteredValue;
    }
}
// =====================================================
// 搜索专用事件
// =====================================================
const _getSearchKeyWord = (reference, field, keyword = "") => {
    // 搜索文字
    let {$keyword = {}} = reference.state ? reference.state : {};
    $keyword[field] = keyword;
    $keyword = Abs.clone($keyword);
    return $keyword;
};

const onSearchClear = (reference, field, clearFilters) => (event) => {
    if (event && Abs.isFunction(event.preventDefault)) {
        event.preventDefault();
    }
    clearFilters();// 设置高亮
    const $keyword = _getSearchKeyWord(reference, field, "");
    const $condition = getCondition(reference, field, []);
    reference.setState({
        $keyword, $condition,
        $resetCond: Ut.randomString(8),
    });
};

const _onSearchConfirm = (reference, field, selectedKeys, {
    confirm,
    clearFilters
}) => () => {
    confirm();
    // 空值直接触发重置
    if (0 === selectedKeys.length) {
        onSearchClear(reference, field, clearFilters)();
    } else {
        /* 设置条件 $condition 信息 */
        const $condition = getCondition(reference, field, selectedKeys);
        reference.setState({
            $condition,
        });
    }
};
// =====================================================
// 搜索专用下拉
// =====================================================
const _filterSearchDropdown = (field, config = {}, reference = {}) => (filterConfig = {}) => {
    const {placeholder = "", button = {}} = config;
    const {setSelectedKeys, selectedKeys = [], confirm, clearFilters} = filterConfig;
    const clearAttrs = getClearAttrs(reference, field, {
        selectedKeys, clearFilters, onClear: onSearchClear,
    });
    return (
        <div style={{padding: 8}}>
            <Input placeholder={placeholder}
                   value={selectedKeys[0]}
                   onChange={(event) => {
                       const highlight = event.target.value;
                       const searchText = highlight ? [highlight] : [];
                       setSelectedKeys(searchText);
                       // 设置高亮
                       const $keyword = _getSearchKeyWord(reference, field, highlight);
                       // 修改 $condition，这个时候不会导致触发
                       reference.setState({$keyword});
                   }}
                   onPressEnter={_onSearchConfirm(reference, field, selectedKeys, {
                       confirm, clearFilters
                   })}
                   style={{width: 188, marginBottom: 8, display: 'block'}}
            />
            <Button type="primary" icon="search" className={"ux-red"}
                    onClick={_onSearchConfirm(reference, field, selectedKeys, {
                        confirm, clearFilters
                    })}
                    style={{width: 90, marginRight: 8}}>
                {button.search ? button.search : false}
            </Button>
            <Button {...clearAttrs}
                    style={{width: 90}}>
                {button.reset ? button.reset : false}
            </Button>
            {Fn.anchorColumn(field, clearAttrs.onClick)}
        </div>
    );
};
const renderSearch = (reference, column, config) => {
    // filterIcon
    column.filterIcon = getFilterIcon(reference, column.dataIndex, "search");
    // filterDropdown
    column.filterDropdown = _filterSearchDropdown(column.dataIndex, config, reference);
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
    const filteredValue = getFilteredValue(reference, column);
    if (0 < filteredValue.length) {
        column.filteredValue = filteredValue;
    } else {
        if (column.filteredValue) delete column.filteredValue;
    }
    // 重写render
    // _mountHighlight(column, reference);
};

// =====================================================
// 三个主方法
// =====================================================
const renderDirect = (reference, column, config) => {
    if (!Abs.isEmpty(config)) {
        // 下拉处理
        const options = [];
        // 直接解析 datum
        // 也会得到 key, label, value
        const datum = R.Ant.toOptions(reference, config);
        datum.forEach(each => options.push({
            label: each.label,
            value: each.value
        }));
        // 下拉专用
        mountDropdown(reference, options, {column, config});
    } else {
        console.error(`[Err] type = DIRECT 的模式要求必须配置 config，没配置 config 节点`);
    }
};

const renderDatum = (reference, column, config) => {
    // 下拉列表处理
    if (!Abs.isEmpty(config)) {
        // 下拉处理
        const {$datum} = column;
        let datumConfig = {};
        if ("string" === typeof $datum) {
            datumConfig = R.Ant.toParsed($datum);
        } else {
            Object.assign(datumConfig, $datum);
        }
        // 选项处理
        const options = [];
        const datumData = R.Ant.toOptions(reference, {datum: datumConfig});
        datumData.forEach(each => options.push({
            label: each.label,
            value: each.value,
        }));
        // 下拉专用
        mountDropdown(reference, options, {column, config});
    } else {
        console.error(`[Err] type = DATUM 的模式要求必须配置 config，没配置 config 节点`);
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /*
     * {
            "$filter.config.dataType": "BOOLEAN",
            "$filter.config.items": [
                "true,启用",
                "false,禁用"
            ],
            "$filter.config.button": {
                "yes": "确认",
                "reset": "重置"
            },
            "$filter.config.width": {
                "radio": 110,
                "button": 55
            }
     * }
     */
    DIRECT: renderDirect,
    /*
     * {
            "$filter.type": "SEARCH",
            "$filter.config": {
                "placeholder": "输入用户组名称",
                "button": {
                    "search": "搜索",
                    "reset": "重置"
                }
            }
     * }
     */
    SEARCH: renderSearch,
    /*
     * {
     *      "$filter.type": "DATUM",
            "$filter.config.button": {
                "yes": "确认",
                "reset": "重置"
            },
            "$datum": "必须"
     *
     * }
     */
    DATUM: renderDatum
}