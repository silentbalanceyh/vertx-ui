import func_wait_skin_initialize from './wait.fn.skin.initialize';
import func_plot_of_document from './plot.fn.of.document';
import func_plot_mix_attr from './plot.fn.mix.attr';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ...func_wait_skin_initialize,
    /*
     * 所有 of 类的API都遵循签名
     * （cssOptions, reference）
     *
     * 1）直接使用cssOptions中的名称处理（代表默认）
     * 2）若存在计算，计算标识的位置
     * _<name>:     代表分子
     * <name>_:     代表分母
     * <name>_x:    代表乘法（几倍）
     * <name>_p:    代表百分比
     * 3）带计算的通常会从 document 执行自适应效果
     * 最终返回 style 属性所需格式
     */
    ...func_plot_of_document,
    /*
     * 所有 mix 类的API都遵循签名
     * (className, styleFn, reference)
     * 最终返回
     * {
     *     className,
     *     style: styleFn = ()
     * }
     */
    ...func_plot_mix_attr,
}