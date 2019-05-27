import In from './Op.In';
import Column from './Op.Column';

const isRender = (reference) => {
    const {options = {}, ready = false} = reference.state;
    if (options['column.dynamic']) {
        const {readyColumn = false} = reference.state;
        return ready && readyColumn;
    } else return ready;
};

const update = (reference, previous = {}) => {
    // reference.setState({ready: false});
    const state = reference.state;
    const {ready = false} = state;
    if (ready) {
        // 特殊情况需要初始化列信息
        Column.initColumn(reference);
    }
};
export default {
    ...In,
    update,
    isRender,
};