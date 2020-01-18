import Ux from 'ux';

const rxReject = () => (reference, config = {}) => (event) => {
    Ux.prevent(event);
    return Ux.sexBatch(reference, (keys = []) => {
        const {ajax = {}} = config;
        return Ux.asyncPromise(ajax, {keys});
    }, {name: "rxBatchApproval", message: config.message});
};
export default {
    rxReject,
}