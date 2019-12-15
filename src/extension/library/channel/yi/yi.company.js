import Yo from '../yo';
import Ux from 'ux';
import yiAssist from './yi.assist'

export default (reference) => {
    const state = Yo.yoAmbient(reference);
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
    return yiAssist(reference, state)
        .then(updated => {
            updated.$ready = true;
            reference.setState(updated);
        })
}