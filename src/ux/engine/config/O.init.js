import Abs from '../../abyss';
import Pr from '../parser';
/*
 * 该方法和其他方法独立出来，用于将初始值
 * 的配置和表单本身的配置直接剥离开，防止混乱
 * 而且添加和编辑过程中的初始化方法不一样
 */
const initial = (reference, form, program = {}) => {
    /*
     * 读取字段本身配置
     * 1）对于 form.initial 的处理在于：
     * - $mode = ADD 的时候
     * 2）如果 $mode = EDIT 则直接跳过该流程
     */
    const {$mode} = reference.props;
    if ($mode) {
        let initial = {};
        if ("ADD" === $mode) {
            if (form && form.initial) {
                /*
                 * 解析表达式
                 */
                let definition = {};
                Object.keys(form.initial)
                /* 直接过滤得到最终的表达式 */
                    .filter(key => "string" === typeof form.initial[key])
                    .forEach(key => {
                        const value = Pr.parseValue(form.initial[key], reference);
                        if (value) {      // undefined !== value
                            definition[key] = value;
                        }
                    });
                initial = definition;
            }
        } else {
            /*
             * EDIT 编辑模式
             */
            const {$inited = {}} = reference.props;
            initial = Abs.clone($inited);
        }
        if (!Abs.isEmpty(program)) {
            Object.assign(initial, program);
        }
        return initial;
    } else {
        console.error("[ Ux ] 初始化流程失败，不可调用 `initial` 方法，必须参数 `$mode` 缺失。");
        return {};  // 防止错误信息
    }
};
export default {
    initial,
}