import Api from '../ajax';
import U from 'underscore';
import Ex from 'ex';
import Ux from 'ux';
import {HocI18r} from 'entity';

const _asyncModule = (state = {}, $router) => {
    /*
     * 读取路径
     */
    const path = $router.path();
    return Api.module(path).then(module => {
        if (module && U.isObject(module.metadata)) {
            /*
             * HocI18n 的协变对象，用于处理远程
             */
            state.$hoc = new HocI18r(module.metadata);
        }
        return Ex.promise(state);
    });
};
const _asyncStored = (state = {}, reference) => {
    reference.setState(state);
    return Ex.promise(state);
};
const _asyncQuery = (state = {}, reference) => {
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
    return Ex.promise(state);
};
export default (reference) => {
    const {$router} = reference.props;
    if (!$router) {
        throw new Error("[ Ex ] $router变量丢失！");
    }
    /*
     * 读取参数信息
     */
    const state = {};
    return _asyncModule(state, $router)
        .then(data => _asyncStored(data, reference))
        .then(data => _asyncQuery(data, reference))
        .then(data => {
            data.$ready = true;
            reference.setState(data);
        })
};