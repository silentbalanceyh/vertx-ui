import Ux from "ux";

export default (reference, state = {}) => {
    const $query = Ux.cabQuery(reference);
    if ($query) {
        const {$router} = reference.props;
        const params = $router.params();
        if (params.type) {
            $query.criteria['type,='] = params.type;
        }
        if (params.status) {
            $query.criteria['status,='] = params.status;
        }
        if (1 < Object.keys($query.criteria).length) {
            $query.criteria[''] = true;
        }
        /*
         * 构造 state
         */
        state.$query = $query;
    }
    return Ux.promise(state);
}