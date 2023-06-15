import __Zn from './zero.module.dependency';
import __v4Initial from './antd4.__.@fn.v4.initial.value';

const __cssOnChange = () => __Zn.Env.TYPE_JSX_VALIDATE;
const __v4FormSynonym = (item = {}, configuration = {}) => {
    const {
        reference,
        cell,
    } = configuration;
    /*
     * 双源头同义处理
     * 1. 第一源头来自于表单本身的配置
     * {
     *      "_form":{
     *          "synonym": {}
     *      }
     * }
     * 2. 第二源头来自于属性传入 $synonym
     *
     * 第二源头为编程模式，高优先级
     */
    const {$synonym = {}, config = {}} = reference.props;
    const {synonym = {}} = config.form ? config.form : {};

    /*
     * 编程方式：高优先级计算（截断模式）
     */
    if ($synonym?.hasOwnProperty(cell.field)) {
        item.label = $synonym[cell.field];
        return;
    }

    /*
     * 配置方式：低优先级（截断模式）
     */
    if (synonym.hasOwnProperty(cell.field)) {
        item.label = synonym[cell.field];
    }
    // 旧代码，每次 assign 做对象合并没有必要
    // const vector = __Zn.clone(synonym);     // （低优先级）配置模式
    // Object.assign(vector, $synonym);        // （高优先级）编程模式
}

const __v4Validation = (item = {}, configuration = {}) => {
    const {
        cell = {},
    } = configuration;
    const {
        optionJsx = {},
        optionConfig = {},
        optionItem = {}
    } = cell;
    // normalize / validateTrigger
    const {
        normalize,
        validateTrigger,
        rules,
    } = optionConfig;
    // 输入限制
    if (__Zn.isFunction(normalize)) {
        item.normalize = normalize;
    }
    const webValidate = __cssOnChange();
    const enabled = !optionJsx.disabled;
    const edition = !optionJsx.readOnly;
    if (enabled && edition) {
        // 此时才开启验证规则 rules, validateTrigger
        // hasFeedback
        if (rules && 0 < rules.length) {
            item.rules = rules;
            if (webValidate.hasOwnProperty(cell.render)) {
                // 固定值
                item.validateTrigger = "onChange";
            } else {
                if (validateTrigger) {
                    item.validateTrigger = validateTrigger;
                }
            }
            // hasFeedback 必须是配置出来的，且只有验证时有用
            if (optionItem.hasFeedback) {
                item.hasFeedback = optionItem.hasFeedback;
            }
        }
    }
}
/*
 * <Form.Item/> 中的计算法则，主要来源于早期的
 * 1. optionConfig
 * 2. optionItem
 * 新版需将 optionConfig 中的部分属性转移到 optionItem 中形成统一属性才可生效
 */
export default (values = {}, configuration = {}) => {
    const {
        reference,
        cell,   // optionJsx 是计算之后的
    } = configuration;
    const {
        optionItem = {},
    } = cell;
    // 计算 item 基础
    const $item = __Zn.clone(optionItem);
    // name 属性
    $item.name = cell.field;
    // label 属性计算
    __v4FormSynonym($item, {cell, reference});
    // initialValue / valuePropName 计算 / moment 类型处理
    __v4Initial($item, {cell, reference, values});
    // rules, validateTrigger, normalize, hasFeedback
    __v4Validation($item, {cell, reference});
    return $item;
}