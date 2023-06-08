import TOTAL from './render.__.fn._.total';
import ROW from './render.__.fn._.row';
import CONNECT from './render.__.fn._.connect';
import EDITOR from './render.__.fn._.editor';
import CURRENCY from './render.__.fn._.currency';
import DATE from './render.__.fn._.date';
import DATUM from './render.__.fn._.datum';
import DICT from './render.__.fn._.dict';
import FILE_SIZE from './render.__.fn._.filesize';
import EXECUTOR from './render.__.fn._.executor';
import TAG from './render.__.fn._.tag';
import HYPERLINK from './render.__.fn._.hyperlink';
import LOGICAL from './render.__.fn._.logical';
import MAPPING from './render.__.fn._.mapping';
import PERCENT from './render.__.fn._.percent';
import PURE from './render.__.fn._.pure';
import TEXT from './render.__.fn._.text';
import LAZY from './render.__.fn._.lazy';
import ARRAY from './render.__.fn._.array';
import RENDERS from './render.__.fn._.renders';

export default {
    /*
     * 「编程模式」列配置
     * {
     *      "metadata": "field,title,RENDERS",
     *      "style": "",
     *      "className": ""
     *      "config": {
     *          "value": "code",
     *          "mapping": {
     *              "globalId": "sourceGlobalId",
     *              "name": "sourceName",
     *              "identifier": "sourceIdentifier"
     *          }
     *      }
     * }
     *
     * 场景：
     * 根据 $renders 提取编程信息，没有 $renders 时转 TEXT
     *
     * 属性：
     * - $expr
     * - $empty
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」支持 $expr
     * - 「o」支持 $empty
     */
    ...RENDERS,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,ARRAY",
     *      "style": "",
     *      "className": ""
     * }
     *
     * 场景：
     * 数组构成模式，列表呈现数据
     *
     * 属性：
     * - $expr
     * - $empty
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」支持 $expr
     * - 「o」支持 $empty
     */
    ...ARRAY,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,USER",
     *      "style": "",
     *      "className": "",
     *      "$config": {
     *          "uri": "/api/user/:key",
     *          "field": "realname",
     *          "method": "GET"
     *      }
     * }
     *
     * 场景：
     * 带链接的延迟加载专用模式，可支持图标等
     *
     * 属性：
     * - $expr
     * - $empty
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」支持 $expr
     * - 「o」支持 $empty
     */
    ...LAZY,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,<?>",
     *      "style": "",
     *      "className": "",
     *      "$config": {
     *          "url"
     *      }
     * }
     *
     * 场景：
     * 默认值，可不填写
     *
     * 属性：
     * - $expr
     * - $empty
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」支持 $expr
     * - 「o」支持 $empty
     */
    ...TEXT,
    /*
     * 列配置（高亮专用）
     * {
     *      "metadata": "field,title,PURE",
     *      "style": "",
     *      "className": "",
     *      "$empty": "",
     *      "highlight": ""
     *      "$config": {
     *      }
     * }
     *
     * 场景：
     * - 可支持高亮模式的文本处理
     *
     * 属性：
     * - highlight 开启高亮
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」不支持 $expr
     * - 「o」支持 $empty
     */
    ...PURE,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,PERCENT",
     *      "style": "",
     *      "className": "",
     *      "$empty": ""
     *      "$config": {
     *      }
     * }
     *
     * 场景：
     * - 呈现百分比
     *
     * 属性：
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「o」支持 $empty
     */
    ...PERCENT,
    /*
     * 列配置（LOGICAL增强版）
     * {
     *      "metadata": "field,title,MAPPING",
     *      "style": "",
     *      "className": "",
     *      "$mapping": {
     *          "value1": "消费项,pay-circle,16,#268941",
     *          "value2": "付款项,pay-circle,16,#f6af03"
     *      }
     * }
     *
     * 场景：
     * - 多值模式专用
     *
     * 属性：
     * - 表达式格式：text - 文字信息
     *             icon - 图标基本信息
     *             size - 图标大小
     *             color - 图标颜色
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」支持 $expr
     * - 「o」支持 $empty
     */
    ...MAPPING,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,LOGICAL",
     *      "style": "",
     *      "className": "",
     *      "$mapping": {
     *          "true": "消费项,pay-circle,16,#268941",
     *          "false": "付款项,pay-circle,16,#f6af03"
     *      }
     * }
     *
     * 场景：
     * 逻辑模式专用，主要处理 true / false 两种模式，支持图标信息
     *
     * 属性：
     * - 表达式格式：text - 文字信息
     *             icon - 图标基本信息
     *             size - 图标大小
     *             color - 图标颜色
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」支持 $expr
     * - 「o」支持 $empty
     */
    ...LOGICAL,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,HYPERLINK",
     *      "style": "",
     *      "className": "",
     *      "$config": {
     *          "url"
     *      }
     * }
     *
     * 场景：
     * 调用 React-Router 专用链接函数
     *
     * 属性：
     * - url，可支持表达式的链接信息
     * - 支持浮游文字专用任务，Tooltip面板处理
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」支持 $expr
     * - 「o」支持 $empty
     */
    ...HYPERLINK,
    ...TAG,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,EXECUTOR",
     *      "$option": [
     *          {
     *              "text": "编辑",
     *              "executor": "fnEdit"
     *          },
     *          "divider",
     *          {
     *              "text": "删除",
     *              "executor": "fnDelete",
     *              "confirm": "确认删除选择的实体记录？"
     *          }
     *      ]
     * }
     *
     * 场景：
     * 专用操作按钮
     *
     * 属性：
     *
     * - text：链接文字
     * - executor：外围专用函数（$executor）     $plugins.koRow 执行操作符过滤
     * - confirm：浮游提示框文字
     *
     * 标准化：
     * - 「x」不支持 style, className 默认
     * - 「o」不支持 $expr，转移到 text 文字中
     * - 「x」不支持 $empty
     */
    ...EXECUTOR,
    // field = 属性信息，对应 dataIndex，title = 标题信息，对应 title
    /*
     * 列配置
     * {
     *      "metadata": "field,title,TOTAL",
     *      "style": "",
     *      "className": "",
     *      "$config": {
     *          "field": [
     *              "操作字段1",
     *              "操作字段2"
     *          ],
     *          "op": "P = Plus,加法，M = 乘法",
     *          "currency": "货币单位"
     *      }
     * }
     *
     * 场景：
     * 单价 x 数量 = 总价
     *
     * 属性：
     * - field, 执行计算的操作字段（当前record记录中）
     * - op，分两种求和（连乘和连加）
     * - currency：货币单位
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「x」不支持 $empty
     */
    ...TOTAL,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,ROW",
     *      "$config": {
     *          "field": "aiTreeSelect",
     *          "jsx": {
     *              "style": {
     *                  "width": "160px"
     *              },
     *              "config": {
                        "datum": "source=term.expense,key=key,label=code",
                        "expr": ":name（:code）",
                        "tree": "text=label,parent=parentId"
                    }
     *          }
     *      }
     * }
     *
     * 场景：
     * 链接到表单组件，可输入而产生表格编辑效果（拓展为表格编辑）
     *
     * 属性：
     * - field, 可操作的表单渲染方法（参考表单部分）
     * - jsx，对应表单组件中的 optionJsx
     * - fieldCond, 条件字段，默认 key（更新数据专用）
     * - fieldKey，提值字段，通常为主键，默认key（更新数据专用）
     *
     * 标准化：
     * - 「x」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「x」不支持 $empty
     */
    ...ROW,
    /*
     * 「保留」列配置
     * {
     *      "metadata": "field,title,CONNECT",
     *      "style": "",
     *      "className": "",
     *      "$option": [
     *          "添加",
     *          "删除"
     *      ]
     * }
     *
     * 场景：
     * 多个链接连接操作专用，该操作依赖注入的 reference 的状态变量，状态中必须包含：
     * $connect = [
     *      {
     *          "config": {
     *              "pos": "链接到 column.dataIndex"
     *          }
     *      }
     * ]
     * 最终会渲染成类似如下链接
     *
     * 添加 | 删除 | 编辑
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「x」不支持 $empty
     */
    ...CONNECT,

    /*
     * （Zero Extension工具管理界面内部专用）列配置
     * {
     *      "metadata": "field,title,EDITOR",
     *      "$config": {
     *          "render": "aiSelect",
     *          "optionJsx.config.items":[
     *              "GET,GET方法",
     *              "PUT,PUT方法
     *          ]
     *      }
     * }
     *
     * 旧版使用config，新使用$config和外层统一，由于历史原因，EDITOR 和 ROW 有点重复，但为了
     * 使得整个界面一致，推荐优先使用EDITOR，次之则使用ROW，属性内容可参考 ROW 类型。
     *
     * 场景：
     *
     * 表格编辑
     *
     * 标准化：
     * - 「x」不支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「x」不支持 $empty
     */
    ...EDITOR,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,CURRENT",
     *      "style": "",
     *      "className": "",
     *      "$empty": ""
     *      "$config": {
     *          "unit": "￥",
     *          "after": "true | false"
     *      }
     * }
     *
     * 场景：
     * - 呈现金额信息，显示货币金额
     *
     * 属性：
     * - unit：货币单位，默认使用￥（人民币）
     * - after：货币和金额的位置
     *    - after = true：1,200￥
     *    - after = false：￥1,200
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「o」支持 $empty
     */
    ...CURRENCY,

    /*
     * 列配置
     * {
     *      "metadata": "field,title,DATE",
     *      "style": "",
     *      "className": "",
     *      "$empty": "",
     *      "$format": "YYYY-MM-DD",
     *      "$config": {
     *          "format"
     *      }
     * }
     *
     * 场景：
     * - 主要用于呈现时间信息
     *
     * 属性：
     * - 旧版：$format用来描述时间格式
     * - 新版：$config.format用来描述时间格式（低优先级）
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「o」支持 $empty
     */
    ...DATE,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,DATUM",
     *      "style": "",
     *      "className": "",
     *      "$datum": "source=bill.type,value=code,display=name",
     *      "$empty": "xxxx"
     *      "$config": {
     *          "adorn": {
     *              "field": "f1",
     *              "items": {
     *                  "record[f1]": "icon,size,color",
     *                  "record[f2]": "icon,size,color",
     *              }
     *          }
     *      }
     * }
     *
     * 场景：
     * - 字典信息专用处理，执行复杂的字典结构
     *
     * 属性：
     *
     * - $datum: source     = 字典名称
     *           value      = 字典值字段
     *           display    = 字典显示字段（display可支持 $expr 格式）
     * - adorn：修饰专用，可让字典类型支持图标格式，通常根据某个属性的值进行计算，主要修饰 icon
     *
     * 此处的 column 可支持三种格式：
     *
     * 1. 常用
     * {
     *      "$datum": "xxxxx"       // 新版常用格式
     *      "datum": "xxxxx"        // 旧版常用格式
     *      "items": "xxxxx"        // 「不推荐使用」静态格式，可直接使用MAPPING替代，所以一般不使用
     * }
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」不直接支持 $expr，但可直接在 display 中书写可解析表达式
     * - 「o」支持 $empty
     */
    ...DATUM,
    /*
     * 「可注入函数」列配置
     * {
     *      "metadata": "field,title,DICT",
     *      "$config": {
     *          "field": "xxx"
     *      }
     * }
     *
     * 场景：
     * 纯字典类型，从 props 中提取专用字典 $dict，如果字典有问题则渲染异常信息，这种模式支持函数
     *
     * 属性：
     * - field：默认使用name，也可使用其他属性信息，特殊 $dict 专用
     *
     * 标准化：
     * - 「x」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「x」不支持 $empty
     */
    ...DICT,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,FILE_SIZE",
     *      "style": "",
     *      "className": "",
     *      "$empty": ""
     * }
     *
     * 场景：
     * - 智能显示文件尺寸
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」不支持 $expr
     * - 「o」支持 $empty
     */
    ...FILE_SIZE,
}