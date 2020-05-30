import Ux from 'ux';

const rxChange = (reference) => (checked = []) => {
    const {$source = []} = reference.props;
    const fields = $source.map(item => item.value);
    const data = {};
    fields.forEach(field => data[field] = false);
    checked.forEach(field => data[field] = true);
    /* 数据处理 */
    reference.setState({data: checked});
    Ux.fn(reference).onChange(data);
}
const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    /* 属性数据 */
    const {value} = reference.props;
    const data = [];
    if (value) {
        Object.keys(value).filter(key => value[key])
            .forEach(item => data.push(item));
    }
    state.data = data;
    reference.setState(state);
}
export default {
    yiPage,
    rxChange,
}