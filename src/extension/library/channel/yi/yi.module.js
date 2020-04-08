import Api from '../../ajax';
import Ux from 'ux'
import {HocI18r} from 'entity';

/**
 * ## 扩展函数
 *
 * 一个 module 的配置信息来源于三部分：
 *
 * 1. `UI.json`：静态配置，会在 reference 中生成 $hoc 变量
 * 2. 远程的 UI_MODULE中的 metadata 字段
 *      * （默认值）最初的 metadata 字段为 FILE 模式（即文件路径）
 *      * （动态管理）如果管理过程中执行了更新，那么直接就是 metadata 的内容
 * 3. 如果 standard = false 那么不考虑 $hoc 的生成，而是直接使用 hoc 变量
 *      * 这种情况不引入 HocI18r 同样不引入 HocI18n 两个数据结构
 * 4. 如果 `standard = true` 那么有两种可能
 *      * 已经绑定过 UI.json，则使用混合模式（远程优先）
 *      * 未绑定过 UI.json，则直接使用远程模式
 *
 * @memberOf module:_channel
 * @method yiModule
 * @param {ReactComponent} reference React对应组件引用
 * @param {State} state 返回当前组件状态
 * @param {boolean} standard 是否执行标准化
 * @returns {Promise<T>} 执行更新过后的状态
 */
export default (reference, state = {}, standard = true) => {
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