import Ux from 'ux';
import St from './submit';
/*
 * 基础字段
 * - aiAction
 * - aiTitle
 * - aiX
 */
const $opDataIn = (data = {}, reference) => {
    const $data = reference.props.data;
    const message = Ux.fromHoc(reference, "message");
    const {optionItem = {}} = data;
    /* 初始化 */
    const $inited = {};
    {
        // 外层输入的标签信息
        if (optionItem.label &&
            message.label !== optionItem.label) {
            $inited.label = optionItem.label;
        }
        $inited.render = $data.render;  // 当前 render
        $inited.allowClear = false;     // 不允许清空
    }
    return $inited;
}
/*
 *
 * field,           // 字段名
 * optionJsx,       // 配置项
 * optionConfig,    // 验证规则
 * optionItem,      // 基础选项
 * span,            // 自动处理
 */
const $opDataOut = (normalized = {}, data = {}, reference) => {
    St.dataInit(normalized, data);
    /*
     * 基础配置
     * {
     *      "field": "field",
     *      "label": "optionItem.label",
     *      "width": "optionItem.style.width",
     *      "placeholder": "optionJsx.placeholder"
     * }
     */
    St.dataField(normalized, data);
    /*
     * 基础属性配置
     * {
     *      "readOnly": "optionJsx.readOnly",
     *      "inscribe": "optionJsx.inscribe",
     *      "allowClear": "optionJsx.allowClear",
     *      "maxLength": "optionJsx.maxLength"
     * }
     */
    St.dataBasic(normalized, data);
    /*
     * 修饰专用属性
     * {
     *      "suffix": "optionJsx.suffix",
     *      "prefix": "optionJsx.prefix",
     *      "addonBefore": "optionJsx.addonBefore",
     *      "addonAfter": "optionJsx.addonAfter"
     * }
     */
    St.dataAdorn(normalized, data);
    /*
     * 限制输入处理
     * {
     *      "normalize": "xxx",
     *      "normalizeLength": "xxx",
     *      "normalizePrecision": "xxx"
     * }
     * // 处理最终结果
     * optionConfig.normalize = <normalize>,<length>,<precision>
     */
    St.dataNorm(normalized, data);
    /*
     * 触发项处理
     * {
     *      "impactReset": "optionJsx.depend.impact.reset"
     * }
     */
    St.dataImpact(normalized, data);
    /*
     * 联动规则
     * {
     *      "dependField": "x",
     *      "dependType": "x",
     *      "dependBoolean": "x",
     *      "dependEnum": [],
     *      "dependSource": "",
     *      "dependCondition": "",
     *      "dependValue": []
     * }
     * 最终合并三种结果
     * {
     *      "optionJsx.depend.enabled":{
     *          "field": true | false
     *      },
     *      "optionJsx.depend.enabled":{
     *          "field": [
     *              "value1",
     *              "value2"
     *          ]
     *      },
     *      "optionJsx.depend.enabled":{
     *          "field": {
     *              "source": "sourceId",
     *              "field": "condition",
     *              "value": [
     *                  "fieldValue1",
     *                  "fieldValue2"
     *              ]
     *          }
     *      }
     * }
     */
    St.dataEnabled(normalized, data);
    /*
     * 1）必填规则
     * required,
     * requiredMessage,
     * 2）其他规则
     * 2.1）Diff
     * 2.2）Equal
     *
     * 3）设置统一规则
     * ruleX
     * ruleXMessage
     * ruleXTo
     */
    St.dataRules(normalized, data);
    /*
     * 特殊属性
     * 1）密码框
     * optionJsx.visibilityToggle
     *
     * 2）数值输入
     * optionJsx.min
     * optionJsx.max
     * optionJsx.step
     * optionJsx.precision
     * optionJsx.formatter
     * optionJsx.parser
     *
     * 3）多行文本
     * optionJsx.rows
     * optionJsx.autoSize.minRows
     * optionJsx.autoSize.maxRows
     *
     * 4）下拉框
     * optionJsx.mode
     * optionJsx.maxTagCount
     *
     * 5）多选框
     * optionJsx.mode
     * optionJsx.checkedChildren
     * optionJsx.unCheckedChildren
     */
    St.dataComponent(normalized, data);
    /*
     * 选项属性
     * 1）静态和动态数据源
     * optionJsx.config.items
     * optionJsx.config.datum
     * optionJsx.config.datum.source
     * optionJsx.config.datum.value
     * optionJsx.config.datum.label
     *
     * 2）表达式处理
     * optionJsx.config.expr
     *
     * 3）级联
     * optionJsx.config.cascade
     * optionJsx.config.cascade.source
     * optionJsx.config.cascade.target
     */
    St.dataOption(normalized, data);
    /*
     * 1）树专用处理
     * optionJsx.config.tree
     * optionJsx.config.tree.key
     * optionJsx.config.tree.parent
     * optionJsx.config.tree.text
     * optionJsx.config.tree.value
     * optionJsx.config.tree.sort
     * optionJsx.config.tree.leaf
     * optionJsx.config.selection
     */
    // 组件内部调用该方法
    // 只有树组件可用
    // St.dataTree(normalized, data);
    return normalized;
}
export default {
    $opDataIn,
    $opSaveSetting: (reference) => (params = {}) => {
        reference.setState({$loading: false, $submitting: false});
        /* 输出数据信息 */
        const normalized = {};
        const parameters = $opDataOut(normalized, params, reference);
        console.info(params, parameters);
    }
}