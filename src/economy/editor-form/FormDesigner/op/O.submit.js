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
     * // 最终处理结果
     * {
     *      "optionJsx.depend.impact":{
     *          "reset": [
     *              "aField",
     *              "bField"
     *          ]
     *      }
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
     *
     * 最终效果
     * {
     *      "optionConfig.rules":[
     *          {
     *              "required": true,
     *              "message": "xxx"
     *          },
     *          {
     *              "validator": "diff",
     *              "message": "xxx",
     *              "config":{
     *                  "to": "xxxField"
     *              }
     *          }
     *      ]
     * }
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
     * 5）树型下拉
     * optionJsx.config.tree
     * optionJsx.config.tree.key
     * optionJsx.config.tree.parent
     * optionJsx.config.tree.text
     * optionJsx.config.tree.value
     * optionJsx.config.tree.sort
     * optionJsx.config.tree.leaf
     * optionJsx.config.selection
     *
     * 6）多选框
     * optionJsx.mode
     * optionJsx.checkedChildren
     * optionJsx.unCheckedChildren
     *
     * 7）日期 / 时间
     * optionJsx.disabledDate
     * optionJsx.format
     * optionJsx.showToday
     * optionJsx.showTime
     *
     * optionJsx.mode
     * optionJsx.use12Hours
     * optionJsx.hourStep
     * optionJsx.minuteStep
     * optionJsx.secondStep
     *
     * 8）上传组件
     * optionJsx.config.single
     * optionJsx.config.limit
     * optionJsx.config.filekey
     *
     * optionJsx.listType
     * optionJsx.text
     *
     * optionJsx.ajax.uri
     * optionJsx.ajax.download
     * optionJsx.ajax.params
     *
     * 9）穿梭框
     * optionJsx.config.valueKey
     * optionJsx.config.titles
     *
     * 10）富文本 / JsonEditor
     * {
     *      "braftHeight": "optionJsx.config.height",
     *      "jsonHeight": "optionJsx.config.height"
     * }
     *
     * 11）地址选择器
     * optionJsx.config.ajax
     * optionJsx.config.country = {
     *      uri: "xxx",
     *      display: "xxx",
     * }
     * optionJsx.config.state = {
     *      uri: "xxx",
     *      display: "xxx",
     *      parent: "xxx"
     * }
     * optionJsx.config.city = {
     *      uri: "xxx",
     *      display: "xxx",
     *      parent: "xxx"
     * }
     * optionJsx.config.region = {
     *      uri: "xxx",
     *      display: "xxx",
     *      parent: "xxx"
     * }
     * optionJsx.config.init
     *
     * 12）树选择器
     * optionJsx.config.tree
     * optionJsx.config.tree.key
     * optionJsx.config.tree.parent
     * optionJsx.config.tree.text
     * optionJsx.config.tree.value
     * optionJsx.config.tree.sort
     * optionJsx.config.tree.leaf
     *
     * optionJsx.config.selection = {
     *      multiple: true | false
     *      checkStrictly: true | false
     * }
     */
    St.dataComponent(normalized, data, reference);
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
     * Selector 系列
     * 1）表格配置
     * optionJsx.config.table = {
     *      columns: []
     * }
     *
     * 2）ajax 配置
     * optionJsx.config.ajax = {
     *      uri: "xxx",
     *      method: "method",
     *      params:{
     *          criteria: {
     *              cond1: value1,
     *              cond2: value2
     *          },
     *          pager:{
     *              page: x,
     *              size: y
     *          },
     *          sorter: [
     *              "field1,ASC",
     *              "field2,DESC"
     *          ]
     *      }
     *      magic:{
     *          cond1: value1,
     *          cond2: value2
     *      }
     * }
     *
     * 3）窗口配置
     * optionJsx.config.window = {
     *      title: "title",
     *      okText: "Ok文字",
     *      cancelText: "Cancel文字",
     *      maskClosable: false,
     *      width: 640
     * }
     * optionJsx.config.validation = "xxx"
     *
     * 4）搜索配置
     * optionJsx.config.search = {
     *      field1,c: field1,
     *      field2,c: field2
     * }
     */
    St.dataSelector(normalized, data);
    /*
     * 最终删除特殊无效节点
     */
    St.dataFinished(normalized);
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