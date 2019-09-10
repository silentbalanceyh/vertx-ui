import Ux from "ux";

export default (reference, state = {}) => {
    const $query = Ux.cabQuery(reference);
    if ($query) {
        const {$router} = reference.props;
        const params = $router.params();
        $query.criteria['type,='] = params.type;
        /*
         * 构造 state
         */
        state.$query = $query;
    }
    return Ux.promise(state);
}