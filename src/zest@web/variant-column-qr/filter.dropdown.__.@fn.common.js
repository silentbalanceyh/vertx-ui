import __Zn from "./zero.uca.dependency";
import {Button, Checkbox, Col, Row} from "antd";
import React, {useEffect, useState} from "react";
import {SearchOutlined} from "@ant-design/icons";
import Event from './filter.__.fn.on.event';
import Addon from './filter.__.fn.sift.addon';
import __EVENT from "zs/variant-column-qr/filter.__.fn.on.event";

const CSS_DROPDOWN = ({
    padding: 8,
});
const CSS_GROUP_OPTION = ({
    marginBottom: 8
});
const CSS_BUTTON_REGION = ({
    textAlign: "center",
    width: "100%"
})
const CSS_YES = ({
    marginRight: 8,
});
const __cssGroup = (config = {}) => {
    const {options = [], width = {}} = config;
    let styleWidth = 0;
    options.forEach(option => {
        const optionWidth = __Zn.widthWord(option.label, true);
        if (optionWidth > styleWidth) {
            styleWidth = optionWidth;
        }
    })
    return {
        width: width.radio ? width.radio : styleWidth,
        marginBottom: 8, display: "block"
    }
}

const FilterCheckBox = (props) => {
    const [searchOption, setSearchOption] = useState(props.value);
    useEffect(() => {
        setSearchOption(props.value);
    }, [props.value]);
    const {
        config = {},
        column,
        configuration,
        reference,
    } = props;
    const {
        button = {},
        options = []
    } = config;
    const attrEvent = {
        ...configuration,
        field: column.dataIndex,
        value: props.value,
        // Effect,
        setSearchOption
    };

    const isLock = __EVENT.isLock(attrEvent, reference);

    const attrGroup = {};
    attrGroup.style = __cssGroup(config);
    if (isLock) {
        attrGroup.disabled = true;
    } else {
        attrGroup.disabled = false;
        attrGroup.onChange = Event.onCheckedFn(attrEvent);
    }
    attrGroup.value = searchOption;

    const attrYes = {};
    attrYes.type = "primary";
    attrYes.icon = (<SearchOutlined/>);
    attrYes.danger = true;
    attrYes.style = CSS_YES;
    if (isLock) {
        attrYes.disabled = true;
    } else {
        attrYes.disabled = false;
        attrYes.onClick = Event.onConfirmFn(attrEvent, reference);
    }

    const attrNo = {};
    if (isLock) {
        attrNo.disabled = true;
    } else {
        attrNo.disabled = !searchOption || 0 === searchOption.length;
        if (!attrNo.disabled) {
            attrNo.onClick = Event.onResetFn(attrEvent, reference);
        }
    }
    return (
        <div style={CSS_DROPDOWN}>
            <Checkbox.Group {...attrGroup}>
                {options.map(option => (
                    <Row key={option.value} style={CSS_GROUP_OPTION}>
                        <Col span={24}>
                            <Checkbox value={option.value}>{option.label}</Checkbox>
                        </Col>
                    </Row>
                ))}
            </Checkbox.Group>
            <div style={CSS_BUTTON_REGION}>
                <Button {...attrYes}>
                    {button.yes ? button.yes : false}
                </Button>
                <Button {...attrNo}>
                    {button.reset ? button.reset : false}
                </Button>
            </div>
            {__Zn.anchorColumn(column.dataIndex, Addon.siftClean(attrEvent))}
        </div>
    )
}
// eslint-disable-next-line import/no-anonymous-default-export
export default (column, config = {}, reference) => (configuration) => {
    const attrs = {
        column,
        config,
        reference,
        configuration,
    }
    const {selectedKeys = []} = configuration;
    const valueAttr = {};
    valueAttr.value = __Zn.isArray(selectedKeys) ? selectedKeys : [];
    return (
        <FilterCheckBox {...attrs} {...valueAttr}/>
    )
}