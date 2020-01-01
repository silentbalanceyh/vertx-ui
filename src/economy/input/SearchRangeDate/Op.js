import U from "underscore";
import moment from 'moment';
import Ux from 'ux';

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
        if (!moment.isMoment($data.start)) {
            $data.start = Ux.valueTime($data.start, config.format);
        }
    }
    if ($data.end) {
        if (!moment.isMoment($data.end)) {
            $data.end = Ux.valueTime($data.end, config.format);
        }
    }
    $data.mode = config.mode ? config.mode : "FULL";
    _onChange(reference, $data);
};
const _onChange = (reference, $data = {}) => {
    reference.setState({$data});
    const {onChange} = reference.props;
    if (U.isFunction(onChange)) {
        onChange($data);
    }
};
const onStart = (reference) => (value) => {
    let {$data = {}} = reference.state;
    if (moment.isMoment(value)) {
        $data.start = value;
    } else {
        $data.start = null;
    }
    _onChange(reference, $data);
};
const onEnd = (reference) => (value) => {
    let {$data = {}} = reference.state;
    if (moment.isMoment(value)) {
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