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
            start: null, end: null
        })
    }
    const {config = {}} = reference.props;
    if ($data.start) {
        if (!__Zn.isMoment($data.start)) {
            $data.start = __Zn.valueDatetime($data.start, config.format);
        }
    }
    if ($data.end) {
        if (!__Zn.isMoment($data.end)) {
            $data.end = __Zn.valueDatetime($data.end, config.format);
        }
    }
    $data.mode = config.mode ? config.mode : "FULL";
    _onChange(reference, $data);
};
const _onChange = (reference, $data = {}) => {
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
const onStart = (reference) => (value) => {
    let {$data = {}} = reference.state;
    if (__Zn.isMoment(value)) {
        $data.start = value;
    } else {
        $data.start = null;
    }
    _onChange(reference, $data);
};
const onEnd = (reference) => (value) => {
    let {$data = {}} = reference.state;
    if (__Zn.isMoment(value)) {
        $data.end = value;
    } else {
        $data.end = null;
    }
    _onChange(reference, $data);
};
export default {
    yiDefault,
    yiValue,
    onStart,
    onEnd
}