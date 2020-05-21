import yiPage from './O.fn.init'
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
export default {
    yiPage,
    rxChange,
}