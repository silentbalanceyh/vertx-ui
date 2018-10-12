import React from 'react';
import './Cab.less';
import {DatePicker, Radio} from 'antd';
import Op from './Op';
import moment from 'moment';

const renderCheckBox = (reference = {}) => {
    const {source = [], value = {}} = reference.props;
    return (
        <Radio.Group className={"web-checked-radio"}
                     onChange={Op.on2Change(reference)}
                     value={value.checked}>
            {source.map(item => {
                const {label, ...rest} = item;
                return (<Radio {...rest}>{label ? label : ""}</Radio>);
            })}
        </Radio.Group>
    );
};
const renderDatePicker = (reference = {}) => {
    const {date = {}, value = {}} = reference.props;
    const {label, ...rest} = date;
    rest.disabled = Op.calcDisabled(reference);
    const attrs = {className: "rx-readonly"};
    if (value.date) {
        if (moment.isMoment(value.date)) {
            attrs.value = value.date;
        } else {
            attrs.value = moment(value.date);
        }
    }
    return (
        <span className={"web-checked-radio"}>
            {label ? `${label}：` : false}
            <DatePicker {...rest} {...attrs}
                        onChange={Op.on2ChangeDate(reference)}/>
        </span>
    );
};

export default {
    renderCheckBox,
    renderDatePicker
};