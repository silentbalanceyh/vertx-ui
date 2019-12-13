import U from 'underscore';

const yiDefault = (reference) => {
    const {value} = reference.props;
    yiValue(reference, value);
};
const yiValue = (reference, value) => {
    const $data = {};
    if (value) {
        Object.assign($data, value);
    } else {
        Object.assign($data, {
            text: "",
            op: "c"
        });
    }
    _onChange(reference, $data);
};
const _onChange = (reference, $data = {}) => {
    reference.setState({$data});
    const {onChange} = reference.props;
    if (U.isFunction(onChange)) {
        onChange($data);
    }
};
const onChange = (reference) => (event) => {
    const text = event.target.value;
    let {$data = {}} = reference.state;
    $data.text = text;
    _onChange(reference, $data);
};
const onChecked = (reference) => (event) => {
    const checked = event.target.checked;
    let {$data = {}} = reference.state;
    if (checked) {
        $data.op = "=";
    } else {
        $data.op = "c";
    }
    _onChange(reference, $data);
};
export default {
    yiDefault,
    yiValue,
    onChange,
    onChecked
}