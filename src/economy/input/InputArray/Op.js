import Ux from 'ux';

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
const isDisabled = (reference) => {
    const {
        config = {}
    } = reference.props;
    const {$holder = 0} = reference.state;
    const {limit = -1} = config;
    /* 如果 > 0 就检查 */
    if (0 < limit) {
        return ($holder >= limit);
    } else return false;
}
export default {
    isDisabled,
    rxChange,
    onAdd,
    onRemove,
}