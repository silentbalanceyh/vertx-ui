import __Zn from '../zero.uca.dependency';

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
    // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQY9
    $data = __Zn.clone($data);
    __Zn.of(reference).in({
        $data
    }).handle(() => {

        const {onChange} = reference.props;
        if (__Zn.isFunction(onChange)) {
            onChange($data);
        }
    })
    // reference.?etState({$data});
    // const {onChange} = reference.props;
    // if (__Zn.isFunction(onChange)) {
    //     onChange($data);
    // }
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