import U from 'underscore';

const onOk = (reference) => () => {
    const {fnBatchDelete} = reference.props;
    if (U.isFunction(fnBatchDelete)) {
        return fnBatchDelete(reference);
    }
};
export default {
    onOk
};