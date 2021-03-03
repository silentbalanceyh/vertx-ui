import Ux from 'ux';

const $opSaveApproval = (reference) => (data = {}) => Ux.sexBatch(reference, (keys = []) => {
    /*
     * 构造参数
     */
    const params = {};
    params.data = Ux.valueValid(data);
    params.keys = keys;
    return Ux.ajaxPost('/api/todo/confirm', params);
}, {name: "rxSaveApproval", reset: true});
export default {
    actions: {
        $opSaveApproval
    }
}