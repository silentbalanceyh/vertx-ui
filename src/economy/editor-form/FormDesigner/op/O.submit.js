import Ux from 'ux';
import St from './O.submit.data';
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
     * 2）其他规则
     */
    St.dataRules(normalized, data);
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