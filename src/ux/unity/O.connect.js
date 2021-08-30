import E from "../error";
import Abs from '../abyss';

/**
 * ## 「标准」`Ux.connectId`
 *
 * > 必须在`componentDidMount`之后才能执行。
 *
 * 使用外围的代码触发`onClick`操作，点击`id`相匹配的元素。
 *
 * @memberOf module:_unity
 * @param {String} id 触发id的点击事件。
 */
function connectId(id) {
    const ele = document.getElementById(id);
    E.fxWarning(!ele, 10015, id);
    if (ele) {
        ele.click();
    }
}

const cssOnChange = () => ([
    "aiRadio",
    "aiCheckbox",
    "aiSelect",
    "aiListSelector",
    "aiTreeSelect",
    "aiDialogEditor",
    "aiMatrixSelector"
])
const cssDefined = () => ([
    "aiDialogEditor",
    "aiMatrixSelector"
])
const onRenders = () => ([
    "aiDialogEditor"
])
/**
 * ## 「标准」`Ux.connectValidator`
 *
 * 加载特殊属性的实时验证专用函数，解析 optionConfig 中的 rules，并且执行验证。特殊规则如：
 *
 * 修改`validateTrigger`为 onChange的组件：
 *
 * * aiRadio
 * * aiCheckbox
 * * aiSelect
 * * aiListSelector
 * * aiTreeSelect
 * * aiDialogEditor
 * * aiMatrixSelector
 *
 * 禁用组件时删除`rules`属性不执行绑定。
 *
 * @memberOf module:_unity
 * @param {Object} cell 当前表单输入字段专用配置。
 * @return {Object} 返回需要配置的`optionConfig`对象。
 */
const connectValidator = (cell = {}) => {
    /*
     * 需要自动切换配置的地方，从 onBlur 切换到 onChange
     */
    const onValidate = cssOnChange();
    const optionConfig = Abs.clone(cell.optionConfig ? cell.optionConfig : {});
    const {optionJsx = {}} = cell;
    /*
     * 禁用和只读两种情况都禁用验证规则
     */
    const disabled = optionJsx.disabled;
    const readOnly = optionJsx.readOnly;
    if (disabled || readOnly) {
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
        if (optionConfig.rules && onValidate.includes(cell.render)) {
            /*
             * 即使配置了也需要更改
             */
            optionConfig.validateTrigger = "onChange";
        }
    }
    // 特殊绑定
    return optionConfig;
};
/**
 * ## 「标准」`Ux.connectItem`
 *
 * 为表中的`<Item/>`设置验证修饰效果。
 *
 * @memberOf module:_unity
 * @param {Object} cell 字段配置
 * @returns {Object} 返回执行过后的结果
 */
const connectItem = (cell = {}) => {
    const {col = {}} = cell;
    const itemAttrs = Abs.clone(col);
    if (!itemAttrs.className) itemAttrs.className = "";

    const itemOnChange = cssOnChange();

    if (itemOnChange.includes(cell.__render)) {
        // 只添加一次
        if (0 > itemAttrs.className.indexOf("web-form-has-error")) {
            if ("" === itemAttrs.className) {
                itemAttrs.className = `web-form-has-error`;
            } else {
                itemAttrs.className = `web-form-has-error ${itemAttrs.className}`;
            }
        }
        // 追加 itemDefined
        const itemDefined = cssDefined();
        if (itemDefined.includes(cell.__render)) {
            itemAttrs.className = `${itemAttrs.className} web-form-has-error-defined`;
        }
    }
    return itemAttrs;
};
/**
 * ## 「标准」`Ux.connectRenders`
 *
 * 计算表单字段中专用的`$renders`属性，构造最终的render函数。
 *
 * @memberOf module:_unity
 * @param {Object} optionJsx 表单配置中的optionJsx属性。
 * @param {Object} cell 计算过程中的基础配置。
 * @param {Object} renders 渲染函数Object配置，根据字段传入，编程模式。
 */
const connectRenders = (optionJsx = {}, cell = {}, renders = {}) => {
    const renderData = onRenders();
    // 多增加一个条件，目前只针对 DialogEditor 执行下边流程
    if (renderData.hasOwnProperty(cell.render)) {
        /*
         * 子表单 renders 继承
         */
        if (renders && renders.hasOwnProperty(cell.field)) {
            /*
             * 将 renders 注入到 optionJsx 中
             * 底层 DialogEditor 自动读取
             */
            const $renders = renders[cell.field];
            if (Abs.isObject($renders)) {
                optionJsx.$renders = $renders;
            }
        }
    }
}
export default {
    connectRenders,
    connectId,
    connectItem,
    connectValidator,
};