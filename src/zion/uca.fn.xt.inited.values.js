import __Zn from './zero.module.dependency';

const __initialize = (reference, form, program = {}) => {
    /*
     * 读取字段本身配置
     * 1）对于 form.initial 的处理在于：
     * - $mode = ADD 的时候
     * 2）如果 $mode = EDIT 则直接跳过该流程
     */
    const {$mode = "ADD"} = reference.props;
    let initial = {};
    if (form && form.initial) {
        /*
         * 解析表达式
         */
        let definition = {};
        const initialDefinition = __Zn.clone(form.initial);
        Object.keys(initialDefinition).forEach(key => {
            const expr = initialDefinition[key];
            if ("string" === typeof expr) {
                // 字符串
                const value = __Zn.parseValue(initialDefinition[key], reference);
                if (undefined !== value) {      // undefined !== value
                    definition[key] = value;
                }
            } else {
                // 非字符串直接取值
                definition[key] = expr;
            }
        });
        initial = definition;
    }
    if ("EDIT" === $mode) {
        /*
         * EDIT 编辑模式，只追加补充数据
         */
        const {$inited = {}} = reference.props;
        initial = __Zn.assign($inited, initial, 2)
    }
    if (!__Zn.isEmpty(program)) {
        Object.assign(initial, program);
    }
    return initial;
};
/*
 * 新版初始化函数
 * aiInit -> initial（考虑从API接口中移除）
 */
const xtInited = (reference, values = {}) => {

    /*
     * 基础初始化
     */
    const {$inited = {}, $record = {}} = reference.props;
    let initials = {};
    if (values && !__Zn.isEmpty(values)) {
        initials = __Zn.clone(values);
    } else {
        initials = __Zn.clone($inited);
    }
    /*
     * 配置初始化
     */
    const {raft = {}} = reference.state;
    let detect = {};
    if (raft.initial) {
        /*
         * 基础解析
         */
        detect = __initialize(reference, raft, $record);
    }
    /*
     * initials 的优先级高于 detect
     */
    Object.assign(detect, initials);
    // v4:
    // __Zn.v4FormInit(detect);
    return __Zn.clone(detect);   // 拷贝最终的值
}
export default {
    xtInited
}