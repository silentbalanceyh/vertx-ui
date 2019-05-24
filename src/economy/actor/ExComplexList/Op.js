import In from './Op.In';

const initColumn = (reference) => {
    const {options = {}, delayReady = false} = reference.state;
    if (options['column.dynamic'] && !delayReady) {
        const {projection} = reference.state;
        if (!projection) {
            // 只加载一次，所以如果没有$columns，则需要重新处理流程
            reference.setState({delayReady: false});
            const {rxColumn} = reference.props;
            rxColumn({module: options['column.module']})
                .then(projection => reference.setState({
                    projection,
                    delayReady: true,
                }))
        }
    } else {
        reference.setState({ready: true});
    }
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
const isRender = (reference) => {
    const {options = {}, ready = false} = reference.state;
    if (options['column.dynamic']) {
        const {delayReady = false} = reference.state;
        return ready && delayReady;
    } else return ready;
};
export default {
    ...In,
    update,
    isRender,
};