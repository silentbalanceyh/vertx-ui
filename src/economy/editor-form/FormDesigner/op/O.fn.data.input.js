import St from './in';
import Ux from "ux";

const $opDataIn = (normalized = {}, params, reference) => {
    /*
     * field                        -> field
     * optionItem.label             -> label
     * optionItem.style.width       -> width
     * optionJsx.placeholder        -> placeholder
     */
    St.dataField(normalized, params);
    /*
     * optionJsx.readOnly           -> readOnly
     * optionJsx.inscribe           -> inscribe
     * optionJsx.allowClear         -> allowClear
     * optionJsx.maxLength          -> maxLength
     * optionJsx.config.expr        -> expr
     */
    St.dataBasic(normalized, params);
    /*
     * optionJsx.suffix             -> suffix
     * optionJsx.prefix             -> prefix
     * optionJsx.addonBefore        -> addonBefore
     * optionJsx.addonAfter         -> addonAfter
     */
    St.dataAdorn(normalized, params);
    /*
     * optionConfig.normalize       -> normalize
     *                              -> normalizeLength
     *                              -> normalizePrecision
     */
    St.dataNorm(normalized, params);
    /*
     * optionJsx.depend.impact.reset      -> impactReset
     */
    St.dataImpact(normalized, params);
    /*
     * optionJsx.depend.enabled         -> dependEnabled
     *                                  -> dependField
     *                                  -> dependType
     *                                  -> dependBoolean
     *                                  -> dependEnum
     *                                  -> dependSource
     *                                  -> dependCondition
     *                                  -> dependValue
     */
    St.dataEnabled(normalized, params);
    /*
     * 1）必填规则
     * required,
     * requiredMessage,
     * 2）其他规则
     */
    St.dataRules(normalized, params);
    /*
     * 特殊属性
     * 1）密码框
     * optionJsx.visibilityToggle         -> visibilityToggle
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
    St.dataComponent(normalized, params, reference);
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
    St.dataOption(normalized, params);
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
    St.dataSelector(normalized, params);

    /* 去空操作 */
    Ux.denull(normalized);
    return normalized;
}

export default (reference) => (config = {}) => {
    /* 初始化 */
    const $inited = {};
    const {data = {}} = reference.props;
    $inited.render = config.render;
    /* 最终值 */
    const response = $opDataIn($inited, data, reference);
    /* render 必须值 */
    // response.render = config.render;
    return response;
}