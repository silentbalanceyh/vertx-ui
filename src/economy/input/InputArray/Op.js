import Ux from 'ux';

const yiPage = (reference) => {
    const {value} = reference.props;
    let $data = [];
    if (Ux.isArray(value)) {
        $data = value;
    }
    const state = {};
    state.data = $data;
    state.$holder = $data.length;
    state.$ready = true;
    reference.setState(state);
}
const yuPage = (reference, virtualRef = {}) => {
    Ux.xtRevert(reference, virtualRef, {
        reset: (values) => {
            if (undefined === values) {
                /* 无值重置 */
                reference.setState({data: [], $holder: 0});
            } else {
                /* 有值重置 */
                reference.setState({data: values, $holder: values.length});
            }
        }
    })
}
const onAdd = (reference) => (event) => {
    Ux.prevent(event);
    let {$holder = 0} = reference.state;
    $holder += 1;
    reference.setState({$holder});
}
const _onChange = (reference, input = []) => {
    /* 表单中的取值直接读 */
    const normalized = input.filter(item => undefined !== item);
    Ux.fn(reference).onChange(normalized);
}
const onRemove = (reference, index) => (event) => {
    Ux.prevent(event);
    let {$holder = 0, data = []} = reference.state;
    $holder -= 1;
    const $data = [];
    data.forEach((item, idx) => {
        if (idx !== index) {
            $data.push(item);
        }
    });
    reference.setState({$holder, data: $data});
    _onChange(reference, $data);
}
const rxChange = (reference, index) => (event) => {
    const value = Ux.ambEvent(event);
    let {data = []} = reference.state;
    data = Ux.clone(data);
    data[index] = value;
    reference.setState({data});
    _onChange(reference, data);
}
export default {
    yiPage,
    yuPage,
    rxChange,
    onAdd,
    onRemove,
}