import E from "../Ux.Error";
import Immutable from 'immutable';

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
const jctChange = (reference, changedValue) => {
    const onChange = reference.props.onChange;
    if (onChange) {
        const newValue = Object.assign({}, reference.state, changedValue);
        const newState = Immutable.fromJS(newValue).toJS();
        // 特殊处理，将$开头的全部过滤，防止被Hoc注入
        const filteredValue = {};
        Object.keys(newState).filter(key => !key.startsWith("$")).forEach(key => filteredValue[key] = newState[key]);
        onChange(filteredValue);
    }
};
// Js Data Input
export default {
    jctChange,
    jdtRadioWithAll,
    jdtInput,
    jdtRadio
}