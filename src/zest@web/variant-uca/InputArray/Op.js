import __Zn from '../zero.uca.dependency';

const onAdd = (reference) => (event) => {
    __Zn.prevent(event);
    let {$holder = 0} = reference.state;
    $holder += 1;
    __Zn.of(reference).in({
        $holder
    }).done();
    // reference.?etState({$holder});
}
const _onChange = (reference, input = []) => {
    /* 表单中的取值直接读 */
    const normalized = input.filter(item => undefined !== item);
    __Zn.fn(reference).onChange(normalized);
}
const onRemove = (reference, index) => (event) => {
    __Zn.prevent(event);
    let {$holder = 0, data = []} = reference.state;
    $holder -= 1;
    const $data = [];
    data.forEach((item, idx) => {
        if (idx !== index) {
            $data.push(item);
        }
    });
    __Zn.of(reference).in({
        $holder,
        data: $data
    }).handle(() => {

        _onChange(reference, $data);
    })
    // reference.?etState({$holder, data: $data});
    // _onChange(reference, $data);
}
const rxChange = (reference, index) => (event) => {
    const value = __Zn.ambEvent(event);
    let {data = []} = reference.state;
    data = __Zn.clone(data);
    data[index] = value;
    __Zn.of(reference).in({
        data
    }).handle(() => {

        _onChange(reference, data);
    })
    // reference.?etState({data});
    // _onChange(reference, data);
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