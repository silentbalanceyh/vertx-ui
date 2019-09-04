import Ux from "ux";
import {QQuery} from "entity";

export default (reference, state = {}) => {
    const config = Ux.fromHoc(reference, "grid");
    if (config && config.query) {
        /*
         * $query构造
         */
        const query = new QQuery(config.query, reference);
        let $query = query.to();
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