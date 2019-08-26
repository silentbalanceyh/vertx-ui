import Ux from "ux";
import Fn from '../../functions';

export default (reference, state = {}) => {
    const config = Ux.fromHoc(reference, "grid");
    let query = {};
    if (config.query) {
        query = Ux.clone(config.query);
        /*
         * $query构造
         */
        let $query = Ux.irGrid(query, reference);
        const {$router} = reference.props;
        const params = $router.params();
        $query.criteria['type,='] = params.type;
        /*
         * 构造 state
         */
        state.$query = $query;
    }
    return Fn.promise(state);
}