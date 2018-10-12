import {Checkbox, Input} from "antd";
import './Cab.less';
import Op from "./Op";
import React from "react";

const renderCheckBox = (reference = {}) => {
    const {source = [], value = {}} = reference.props;
    return (
        <Checkbox.Group className={"web-checked-input"}
                        onChange={Op.on2Change(reference)}
                        value={value.checked}>
            {source.map(item => {
                const {label, ...rest} = item;
                return (<Checkbox {...rest}>{label ? label : ""}</Checkbox>);
            })}
        </Checkbox.Group>
    );
};
const renderOther = (reference) => {
    const {other = {}, value = {}} = reference.props;
    const {label, ...rest} = other;
    return (
        <span className={"web-checked-input"}>
            {label ? `${label}：` : ""}
            <Input {...rest} value={value.other} className={"web-other-input"}
                   onChange={Op.on2ChangeInput(reference)}/>
        </span>
    );
};
export default {
    renderCheckBox,
    renderOther,
};