import Ux from "ux";
import __MOD from './channel.macrocosm.fn.yi.modulat';
import yiAssist from './channel.@fn.yi.assist';

const __yiParameters = (reference, state = {}) => {
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

export default (reference, inputState) => {
    /*
     * 读取参数信息
     */
    const state = {};
    if (Ux.isObject(inputState)) {
        Object.assign(state, inputState);
    }
    return __MOD.yiModule(reference, state)
        /* 第一种用法 */
        .then(Ux.pipeOr(reference))
        .then(data => yiAssist(reference, data))
        .then(data => __yiParameters(reference, data))
        /* 第二种用法 */
        .then(Ux.ready)
}