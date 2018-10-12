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

const on2Change = (reference) => (keys) => {
    const data = _getValue(reference, 'checked', keys);
    reference.setState(data);
    Ux.xtChange(reference, data);
};
const on2ChangeInput = (reference) => (event) => {
    // 时间格式处理专用
    const text = event.target ? event.target.value : "";
    const data = _getValue(reference, 'other', text);
    reference.setState(data);
    Ux.xtChange(reference, data);
};
const getDefault = () => ({
    checked: [],
    other: undefined
});
export default {
    on2Change,
    on2ChangeInput,
    getDefault
};