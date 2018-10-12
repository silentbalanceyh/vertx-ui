import Ux from 'ux';

const _getValue = (reference, field, value) => {
    let data = reference.state;
    if (data) {
        data = Ux.clone(data);
    } else {
        data = {};
    }
    data[field] = value;
    return data;
};

const on2Change = (reference) => (event) => {
    const value = event.target ? event.target.value : undefined;
    const data = _getValue(reference, 'checked', value);
    reference.setState(data);
    Ux.xtChange(reference, data);
};
const on2ChangeDate = (reference) => (selected) => {
    // 时间格式处理专用
    const data = _getValue(reference, 'date', selected);
    reference.setState(data);
    Ux.xtChange(reference, data);
};
const calcDisabled = (reference) => {
    const {config = {}, value = {}} = reference.props;
    const checked = value.checked;
    if (config.hasOwnProperty('disabled')) {
        return checked === config.disabled;
    } else return false;
};
export default {
    on2Change,
    on2ChangeDate,
    calcDisabled,
};