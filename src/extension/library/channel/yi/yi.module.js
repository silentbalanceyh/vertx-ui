import Api from '../../ajax';
import U from 'underscore';
import {HocI18r} from 'entity';
import Ux from 'ux'

export default (reference, state = {}) => {
    const {$router} = reference.props;
    if (!$router) {
        throw new Error("[ Ex ] $router变量丢失！");
    }
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
        return Ux.promise(state);
    });
}