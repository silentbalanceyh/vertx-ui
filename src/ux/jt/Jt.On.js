import Value from '../Ux.Value'
import Event from './Jt.Event'

const jonInput = (reference, field) => (event) => {
    let state = reference.state;
    state = state ? state : {};
    state[field] = event.target ? event.target.value : undefined;
    state = Value.clone(state);
    reference.setState(state);
    Event.jctChange(reference, state);
};
export default {
    // 输入框的改变
    jonInput,
}