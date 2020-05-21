import E from "../error";
import Abs from '../abyss';

/**
 * ## 标准函数
 *
 * > 必须在`componentDidMount`之后才能执行。
 *
 * 使用外围的代码触发`onClick`操作，点击`id`相匹配的元素。
 *
 * @memberOf module:_connect
 * @param {String} id 触发id的点击事件。
 */
function connectId(id) {
    const ele = document.getElementById(id);
    E.fxWarning(!ele, 10015, id);
    if (ele) {
        ele.click();
    }
}

/**
 * ## 特殊函数「Zero」
 *
 * 加载特殊属性的实时验证专用函数，解析 optionConfig 中的 rules，并且执行验证。特殊规则如：
 *
 * 修改`validateTrigger`为 onChange的组件：
 *
 * * aiSelect
 * * aiListSelector
 * * aiTreeSelect
 * * aiDialogEditor
 *
 * 禁用组件时删除`rules`属性不执行绑定。
 *
 * @memberOf module:_connect
 * @param {Object} cell 当前表单输入字段专用配置。
 * @return {Object} 返回需要配置的`optionConfig`对象。
 */
const connectValidator = (cell = {}) => {
    /*
     * 需要自动切换配置的地方，从 onBlur 切换到 onChange
     */
    const onValidate = Abs.immutable([
        "aiSelect",
        "aiListSelector",
        "aiTreeSelect",
        "aiDialogEditor"
    ]);
    const optionConfig = Abs.clone(cell.optionConfig ? cell.optionConfig : {});
    const {optionJsx = {}} = cell;
    /*
     * 是否禁用
     */
    const disabled = optionJsx.disabled;
    if (disabled) {
        /*
         * 禁用时删除所有验证
         */
        if (optionConfig.rules) {
            delete optionConfig.rules;
        }
    } else {
        /*
         * 解决特殊验证控件的触发事件，保证验证结果
         * 未禁用时开验证
         */
        if (optionConfig.rules && onValidate.contains(cell.render)) {
            /*
             * 即使配置了也需要更改
             */
            optionConfig.validateTrigger = "onChange";
        }
    }
    return optionConfig;
};
export default {
    connectId,
    connectValidator,
};