import Ex from "ex";
import Ux from 'ux';

const $opAdd = (reference) => params => {
    if (params.modelId) {
        const model = Ux.elementUniqueDatum(reference, "data.category",
            'key', params.modelId);
        if (model) {
            /*
             * 切换 model id，防止 tree select 中的问题
             */
            params.modelId = model.identifier;
        }
    }
    return Ex.form(reference).add(params, {
        uri: "/api/graphic",
        dialog: "added"
    });
};
export default {
    actions: {
        $opAdd
    }
}