import {Button, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import __EVENT from './filter.__.fn.on.event';
import __Zn from "./zero.uca.dependency";
import Addon from "./filter.__.fn.sift.addon";

const CSS_DROPDOWN = ({
    padding: 8,
})
const CSS_INPUT = ({
    width: 188,
    marginBottom: 8,
    display: "block"
});
const CSS_YES = ({
    width: 90,
    marginRight: 8,
});
const CSS_NO = ({
    width: 90,
})

const FilterTextBox = (props) => {
    const [searchText, setSearchText] = useState(props.value);
    useEffect(() => {
        setSearchText(props.value);
    }, [props.value]);

    const {
        config = {},
        column,
        configuration,
        reference,
    } = props;

    const {
        placeholder = "",
        button = {}
    } = config;
    const attrEvent = {
        ...configuration,
        field: column.dataIndex,
        value: props.value,
        // Effect
        setSearchText,
    };

    const isLock = __EVENT.isLock(attrEvent, reference);

    const attrInput = {};
    attrInput.placeholder = placeholder;
    attrInput.style = CSS_INPUT;
    if (isLock) {
        attrInput.disabled = true;
    } else {
        attrInput.disabled = false;
        attrInput.onChange = __EVENT.onChangeFn(attrEvent);
        attrInput.onPressEnter = __EVENT.onConfirmFn(attrEvent, reference);
    }
    attrInput.value = searchText;

    const attrYes = {};
    attrYes.type = "primary";
    attrYes.icon = (<SearchOutlined/>);
    attrYes.style = CSS_YES;
    attrYes.danger = true;
    if (isLock) {
        attrYes.disabled = true;
    } else {
        attrYes.disabled = false;
        attrYes.onClick = __EVENT.onConfirmFn(attrEvent, reference);
    }

    const attrNo = {};
    attrNo.style = CSS_NO;
    if (isLock) {
        attrNo.disabled = true;
    } else {
        attrNo.disabled = !searchText;
        if (!attrNo.disabled) {
            attrNo.onClick = __EVENT.onResetFn(attrEvent, reference);
        }
    }
    return (
        <div style={CSS_DROPDOWN}>
            <Input {...attrInput}/>
            <Button {...attrYes}>
                {button.search ? button.search : false}
            </Button>
            <Button {...attrNo}>
                {button.reset ? button.reset : false}
            </Button>
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
    const value = selectedKeys[0] ? selectedKeys[0] : "";
    return (
        <FilterTextBox {...attrs} value={value}/>
    )
}