import React from 'react';
import {
    Cascader,
    Checkbox,
    DatePicker,
    Form,
    Icon,
    Input,
    InputNumber,
    Radio,
    Select,
    Switch,
    TimePicker,
    TreeSelect
} from 'antd';
import Immutable from 'immutable';
import Ai from '../../../ux/ai/AI';
import U from 'underscore';

const Search = Input.Search;
const webListSelector = (pointer, column) => _itemRender(pointer, column, (
    <Search/>
));
const webUser = (pointer, column) => _itemRender(pointer, column, (
    <Search enterButton={<Icon type={"user"}/>}/>
));
const webTimePicker = (pointer, column) => _itemRender(pointer, column, (
    <TimePicker/>
));
const webDatePicker = (pointer, column) => _itemRender(pointer, column, (
    <DatePicker className={"rx-readonly"}/>
));
const webInput = (pointer, column) => _itemRender(pointer, column, (
    <Input/>
));
const webInputNumber = (pointer, column) => _itemRender(pointer, column, (
    <InputNumber/>
));
const webRadio = (pointer, column) => _itemRender(pointer, column, (config) => {
    return (<Radio.Group options={config.radio}/>);
});
const webCascader = (pointer, column) => _itemRender(pointer, column, (config) => {
    return (<Cascader options={config['cascade']}/>);
});
const webTreeSelect = (pointer, column) => _itemRender(pointer, column, (config) => {
    return (<TreeSelect treeData={config.tree}/>);
});
const webSwitch = (pointer, column) => _itemRender(pointer, column, (
    <Switch/>
));
const webCheckbox = (pointer, column) => _itemRender(pointer, column, (config) => {
    return (<Checkbox.Group options={config.checkbox}/>);
});
const webSelect = (pointer, column) => _itemRender(pointer, column, (config) => {
    return (
        <Select>
            {config.options.map(option => {
                const {title, ...rest} = option;
                return (<Select.Option {...rest}>{title}</Select.Option>);
            })}
        </Select>
    );
});
// 布局专用
const _calcItem = (options = {}, column = {}) => {
    options = Immutable.fromJS(options).toJS();
    const {columns, columnIndex} = column;
    Object.assign(options.item, Ai.LayoutTypes[columns + "" + columnIndex]);
    return options;
};
const _itemRender = (reference, column, jsx) => {
    const item = reference.state.$hoc;
    const info = item._("control");
    const options = _calcItem(info, column);
    return (
        <Form.Item {...options.item}>
            {U.isFunction(jsx) ? jsx(options.config) : jsx}
        </Form.Item>
    );
};
export default {
    webInput,
    webInputNumber,
    webRadio,
    webCheckbox,
    webSwitch,
    webSelect,
    webDatePicker,
    webTimePicker,
    webListSelector,
    webUser,
    webTreeSelect,
    webCascader
};