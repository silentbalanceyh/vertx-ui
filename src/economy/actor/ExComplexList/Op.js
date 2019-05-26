import In from './Op.In';

const initColumn = (reference) => {
    const {options = {}, readyColumn = false} = reference.state;
    if (options['column.dynamic'] && !readyColumn) {
        const {readyColumn = false} = reference.state;
        /* 只读取一次列信息 */
        if (!readyColumn) {
            // 只加载一次，所以如果没有$columns，则需要重新处理流程
            const {rxColumn} = reference.props;
            rxColumn({module: options['column.module']})
                .then(projection => reference.setState({
                    projection,
                    readyColumn: true,
                }))
        }
    } else {
        reference.setState({ready: true});
    }
};

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
        initColumn(reference);
    }
};
export default {
    ...In,
    update,
    isRender,
};