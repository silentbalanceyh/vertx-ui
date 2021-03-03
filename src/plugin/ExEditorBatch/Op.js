import Ux from "ux";
import Ex from 'ex';

const $opBatchEdit = (reference) => (data = {}) => {
    const request = Ux.valueValid(data);
    if (Ux.isEmpty(request)) {
        Ux.sexMessage(reference, "validate");
    } else {
        const {$options = {}} = reference.props;
        Ux.sexDialog(reference, "batch", () => Ux.sexBatch(reference, (keys = []) => {
            const params = {};
            params.data = Ux.valueValid(request);
            params.keys = keys;
            /*
             * 批量链接处理
             */
            const uri = $options[Ex.Opt.AJAX_BATCH_UPDATE_URI];
            return Ux.ajaxPut(uri, params);
        }, {name: "rxBatchEdit", reset: true, message: $options[Ex.Opt.MESSAGE_BATCH_UPDATE]}));
    }
};
export default {
    actions: {
        $opBatchEdit
    }
}