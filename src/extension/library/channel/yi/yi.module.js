import Api from '../../ajax';
import Ux from 'ux'
import {HocI18r} from 'entity';

export default (reference, state = {}, hoc = true) => {
    const {$router} = reference.props;
    if (!$router) {
        throw new Error("[ Ex ] $router变量丢失！");
    }
    /*
     * 读取路径
     */
    const path = $router.path();
    return Api.module(path).then(module => {
        if (module && !Ux.isEmpty(module.metadata)) {
            /*
             * HocI18n 的协变对象，用于处理远程
             */
            if (hoc) {
                /*
                 * 没有 $hoc 变量证明没有静态导入，才会执行该操作
                 */
                state.$hoc = new HocI18r(module.metadata);
            } else {
                /*
                 * 前端静态 + 后端动态
                 */
                state.hoc = module.metadata;
            }
        }
        return Ux.promise(state);
    });
}