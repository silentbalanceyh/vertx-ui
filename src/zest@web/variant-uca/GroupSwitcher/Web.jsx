import React from 'react';
import {Select, Tag} from 'antd';
import __Zn from '../zero.uca.dependency';

const renderContent = (reference, values = []) => {
    const {options = [], config = {}} = reference.props
    const {divider = " | ", mode = "TAG", tag = {}} = config;
    const display = options
        .filter(item => values.includes(item.value));
    if ("TAG" === mode) {
        const {color = "purple", style = {fontSize: 15}} = tag;
        return (
            <div>
                {display.map(item => (
                    <Tag key={item.key} color={color}
                         style={style}
                    >{item.label}</Tag>))}
            </div>
        )
    } else {
        return (
            <div>{display.map(item => item.label).join(divider)}</div>
        )
    }
}

const renderView = (reference, values = []) => {
    const {value} = reference.props
    if ("string" === typeof value) {
        return renderEdit(reference, values);
    } else {
        const valueList = 0 < values.length ? values : value;
        if (valueList && 0 < valueList.length) {
            return renderContent(reference, valueList);
        } else {
            const info = __Zn.fromHoc(reference, "info");
            return (
                <div>
                    {info.empty}
                </div>
            )
        }
    }
}
const renderEdit = (reference, values = []) => {
    const {options = [], value} = reference.props
    const info = __Zn.fromHoc(reference, "info");
    if (0 < values.length) {
        const display = options
            .filter(item => values.includes(item.value));
        // Limit for Select
        const attrs = __Zn.yoLimit(reference.props);
        const items = [];
        display.forEach(item => {
            const itemData = {};
            itemData.key = item.key;
            itemData.value = item.value;
            itemData.label = item.label;
            items.push(itemData);
        })
        return (
            <Select {...attrs} value={value}
                    onChange={__Zn.fn(reference).onChange}
                    options={items}/>
        )
    } else {
        return (
            <div>
                {info.empty}
            </div>
        )
    }
}
export default {
    renderView,
    renderEdit
}