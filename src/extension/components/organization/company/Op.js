import Ex from 'ex';
import Ux from "ux";

const $opSaveMy = (reference) =>
    (params) => Ex.form(reference).save(params, {
        uri: '/api/company/:key',
        dialog: "savedMy"
    });
const yiList = (reference) => {
    const state = Ex.yoAmbient(reference);
    /*
     * 处理 $query 部分的信息
     */
    const $query = Ux.cabQuery(reference);
    if ($query) {
        /*
         * 追加条件进入到 criteria
         */
        if (!$query.criteria) $query.criteria = {};
        const {$inited = {}} = reference.props;
        $query.criteria['companyId,='] = $inited.key;
        state.$query = $query;
    }
    Ex.yiAssist(reference, state)
        .then(updated => {
            updated.$ready = true;
            reference.setState(updated);
        });
};
export default {
    actions: {
        $opSaveMy,
    },
    yiList,
}