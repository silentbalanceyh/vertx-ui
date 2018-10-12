import React from 'react';
import {TimePicker} from 'antd';
import Op from './Op';
import moment from 'moment';

const renderTime = (reference, config = {}, field = "") => {
    const {label, format = "HH:mm", placeholder = ""} = config;
    const {value = {}} = reference.props;
    let targetValue = value[field];
    if (targetValue) {
        if (!moment.isMoment(targetValue)) {
            targetValue = moment(targetValue, format);
        }
    } else {
        targetValue = null;
    }
    return (
        <span>
            {label ? `${label}：` : ""}
            <TimePicker format={format} placeholder={placeholder}
                        value={targetValue}
                        onChange={Op.on2Change(reference, field)}/>
        </span>
    )
};

export default {
    renderTime
}