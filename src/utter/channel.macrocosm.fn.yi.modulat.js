import I from './levy.c.api.interface';
import Ux from "ux";
import {HocI18r} from 'entity';

const yiModule = (reference, state = {}, standard = true) => {
    const {$router} = reference.props;
    if (!$router) {
        throw new Error("[ Ex ] $router变量丢失！");
    }
    /*
     * 读取路径
     */
    const path = $router.path();
    return I.module(path).then(module => {

        if (module && !Ux.isEmpty(module.metadata)) {
            /*
             * HocI18n 的协变对象，用于处理远程
             */
            if (standard) {
                /*
                 * 没有 $hoc 变量证明没有静态导入，才会执行该操作
                 * 仅提供远程的操作
                 */
                const {$hoc} = reference.state;
                if ($hoc) {
                    /* 混合模式 */
                    state.$hoc = $hoc.merge(module.metadata);
                } else {
                    state.$hoc = new HocI18r(module.metadata);
                }
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
const yiCombine = (reference, extension = {}) => {
    const {config = {}} = reference.props;
    const defaultConfig = Ux.fromHoc(reference, "combine");
    let $combine = Ux.clone(config);
    $combine = Ux.assign($combine, defaultConfig, 2);
    if (extension['_combine']) {
        $combine = Ux.assign($combine, extension['_combine'], 2);
    }
    return $combine;
}
export default {
    yiModule,
    yiCombine,
}