import yiTable from './O.fn.table';
import Ux from 'ux';

export default (reference) => {
    const state = {};
    /* 表格配置连接专用处理 */
    const {config = {}} = reference.props;
    const {table = {}} = config;
    state.$table = yiTable(reference, table);
    state.$ready = true;
    /* 数据信息 */
    const {data = []} = reference.state;
    const $data = Ux.clone(data);
    if (0 === data.length) {
        /* 新数据记录 */
        $data.push({key: Ux.randomUUID()});
        state.data = $data;
    }
    reference.setState(state);
}