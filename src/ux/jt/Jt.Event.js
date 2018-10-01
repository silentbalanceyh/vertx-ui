import E from "../Ux.Error";
import U from 'underscore';
import Immutable from 'immutable';
import Value from '../value';

const _calculateState = (reference, field, value) => {
    E.fxTerminal(!reference, 10049, reference);
    E.fxTerminal(!reference.state, 10084, reference.state);
    let $state = Immutable.fromJS(reference.state);
    let path = [];
    if (0 < field.indexOf(".")) {
        path = field.split('.')
    } else {
        path = [field];
    }
    $state = $state.setIn(path, value);
    return $state.toJS();
};
const jdtInput = (reference, field) => (event) => {
    const newState = _calculateState(reference, field, event.target.value);
    reference.setState(newState);
    jctChange(reference, newState);

};
const jdtRadio = (reference, field) => (event) => {
    const newState = _calculateState(reference, field, event.target.value);
    reference.setState(newState);
    jctChange(reference, newState);
};
const jdtRadioWithAll = (reference, field = "_META_") => (event) => {
    const newState = _calculateState(reference, field, event.target.value);
    reference.setState(newState);
    jctChange(reference, newState);
};
// 变更专用方法
const jctChange = (reference, changedValue) => {
    const onChange = reference.props.onChange;
    if (U.isFunction(onChange)) {
        // 直接生成新数据
        let newValue = Object.assign({}, reference.state, changedValue);
        newValue = Value.clone(newValue);
        // 特殊处理，将$开头的全部过滤，防止被Hoc注入
        const filteredValue = {};
        Object.keys(newValue)
            .filter(key => !key.startsWith("$"))
            .forEach(key => filteredValue[key] = newValue[key]);
        // 变更数据处理
        onChange(filteredValue);
    } else {
        E.fxFatal(10095, onChange);
    }
};

const jctUnsafe = (reference, nextProps = {}) => {
    const value = nextProps.value;
    /**
     const {__touched} = reference.state;
     const updated = Value.clone(reference.state);
     console.info(__touched, value, updated);
     if ("string" === typeof value) {
        updated[__touched] = value;
    } else {
        Object.assign(value);
    }
     if (updated.hasOwnProperty("__touched")) {
        delete updated.__touched;
    }**/
    reference.setState(value);
};
export default {
    // 改变字段的统一调用方法
    jctChange,
    jctUnsafe,
    jdtRadioWithAll,
    jdtInput,
    jdtRadio
}