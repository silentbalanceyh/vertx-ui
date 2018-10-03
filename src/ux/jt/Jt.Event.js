import E from "../Ux.Error";
import Immutable from 'immutable';
import On from './Jt.On';

const _calculateState = (reference, field, value) => {
    E.fxTerminal(!reference, 10049, reference);
    E.fxTerminal(!reference.state, 10084, reference.state);
    let $state = Immutable.fromJS(reference.state);
    let path = [];
    if (0 < field.indexOf(".")) {
        path = field.split('.');
    } else {
        path = [field];
    }
    $state = $state.setIn(path, value);
    return $state.toJS();
};
const jdtInput = (reference, field) => (event) => {
    const newState = _calculateState(reference, field, event.target.value);
    reference.setState(newState);
    On.jctChange(reference, newState);
};
const jdtRadio = (reference, field) => (event) => {
    const newState = _calculateState(reference, field, event.target.value);
    reference.setState(newState);
    On.jctChange(reference, newState);
};
const jdtRadioWithAll = (reference, field = "_META_") => (event) => {
    const newState = _calculateState(reference, field, event.target.value);
    reference.setState(newState);
    On.jctChange(reference, newState);
};
export default {
    jdtRadioWithAll,
    jdtInput,
    jdtRadio
};