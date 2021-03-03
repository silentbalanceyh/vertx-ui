import abs from './abyss';
import ajax from './ajax';
import constant from './constant';
import develop from './develop';
import element from './element';
import engine from './engine';
import entity from './entity';
import unity from './unity';
import xweb from './xweb';
import romantic from './romantic';

// 图相关
import g6 from './g6';
import g2 from './g2';

import E from './error';

const exported = {
    /**
     * # 原子模块
     *
     * 底层原子类操作，该操作通常不带有任何业务信息，为底层的基础操作，模块内的API不带任何函数前缀，仅为通用函数，此处先列举所有API的相关说明：
     *
     * |函数名|说明|
     * |:---|:---|
     * |assign|Object.assign则增强版，支持三种模式：常用模式、覆盖模式、追加模式，内置对象执行递归嵌套。|
     * |clone|深度拷贝对象，不同模式对象实现不同的拷贝，拷贝对象最终使用`===`方式会检测为false。|
     * |debug|「开发」调试专用函数。|
     * |denull|去空API，将Object中的field = null的键值对移除掉。|
     * |element|读取对应id的HTML元素，等价`document.getElementById`。|
     * |fn|「综合」上层函数调用专用方法。|
     * |getV|「引擎」读取reference的state或props中对应键值下的数据。|
     * |immutable|标准函数，用于构造Immutable中的List/Map对象，调用高层API专用。|
     * |initial|「引擎」不同表单模式中计算初始值的专用函数。|
     * |input|执行带有mapping的正向转换。|
     * |merge|双合并函数，Array和Object两个对象进行同时合并，Object内部合并仅执行`Object.assign`默认模式。|
     * |monad|函数式编程的Monad函数链执行，构造综合函数链。|
     * |output|执行带有mapping的逆向转换。|
     * |packet|「引擎」Promise中断专用函数。|
     * |parallel|并行Promise专用函数。|
     * |pass|「引擎」执行从props -> state过程中的综合合并流程。|
     * |passion|串行Promise专用函数。|
     * |pipe|「引擎」尾部函数，执行`setState`的最终方法。|
     * |prevent|调用`event.preventDefault()`的专用函数，针对`<a/>`特别有效。|
     * |promise|构造异步Promise的专用过程。|
     * |ready|「引擎」设置$ready的值为true，返回Promise。|
     * |sequence|序号生成专用函数，支持大写字母、小写字母、数字三种模式。|
     * |signature|「安全」数字签名专用函数。|
     * |slice|切片函数，针对Object/Array实现切片，生成子元素。|
     * |token|「安全」读取当前用户的token信息。|
     *
     * @module _primary
     */
    /**
     * # 判断模块
     *
     * 判断专用模块，用于各种不同的判断相关信息，函数前缀`is`，通常使用为`Ux.isXXX`。
     *
     * |函数名|说明|
     * |:---|:---|
     * |isArray|判断输入值是否是一个数组（Array）类型。|
     * |isAuthorized|「引擎」判断用户是否登录并执行登录控制。|
     * |isCn|检查输入字符串是否一个合法的中文字符串，通过Unicode值执行检查。|
     * |isCollection|检查输入数据是否集合类型，集合类型包含ES6中的Set。|
     * |isCurrency|检查输入数据是否合法的货币格式数据。|
     * |isDecimal|检查输入数据是否合法的浮点数。|
     * |isDiff|检查两个数据类型（Object/Array）是否内容相同。|
     * |isEmpty|检查传入对象是否为空。|
     * |isFunction|检查传入对象是否一个合法JavaScript函数。|
     * |isIn|检查某个元素是否存在于数组中。|
     * |isInit|「引擎」从LocalStorage中读取初始化已经完成的应用程序的配置数据。|
     * |isLogged|「引擎」从SessionStorage读取登录用户。|
     * |isNotEmpty|isEmpty的逆函数。|
     * |isNumber|判断输入数据是否合法整数。|
     * |isObject|判断输入数据是否合法的Object，排除Array类型。|
     * |isParent|「引擎」判断两个数据是否存在父子关系，父字段可使用第二参执行。|
     * |isQr|「引擎」判断Ajax参数是否合法的查询引擎参数。|
     * |isRoute|「引擎」判断react-router的路由路径是否存在改变。|
     * |isRule|「引擎」判断前端规则是否满足条件，针对Object。|
     * |isRuleAll|「引擎」针对Array，And连接，内置isRule。|
     * |isRuleAny|「引擎」针对Array，Or连接，内置isRule。|
     * |isSame|（略）isDiff逆函数。|
     *
     * @module _is
     */
    /**
     * # 遍历模块
     *
     * 遍历专用模块，支持各种复杂遍历和特殊遍历。
     *
     * |函数名|说明|
     * |:---|:---|
     * |itAmb|二义性Consumer专用函数，遍历Object和Array针对每一个元素执行consumer函数，并且生成新对象。|
     * |itElement|修改Array（以及嵌套Array）中某个Object中的属性对应值，执行某个field的变更，所有内容统一变更。|
     * |itFull|「引擎」全遍历函数，排除undefined,null,0等非法函数。|
     * |itMatrix|矩阵遍历函数。|
     * |itObject|Object对象遍历函数，只遍历合法值，非法值直接过滤。|
     * |itRepeat|重复执行Consumer函数。|
     * |itRow|「引擎」行元素遍历，Array或Object中的`items`属性。|
     * |itTree|树遍历函数。|
     * |itUi|「引擎」表单元素专用遍历函数。|
     * |itValue|多迭代模式下的遍历。|
     *
     * @module _it
     */
    ...abs,

    /**
     * # Ajax专用模块
     *
     * Ajax专用访问处理，其中包括两大类方法：
     *
     * 1. Ajax方法
     * 2. Callback回调方法（带回调响应、消息、执行函数等）。
     *
     * |函数名|说明|
     * |:---|:---|
     * |ajax2Dialog|「回调」弹出窗口2阶函数。|
     * |ajax2Message|「回调」消息提示2阶函数。|
     * |ajax2True|「回调」存在检查2阶函数。|
     * |ajaxDelete|DELETE请求。|
     * |ajaxDialog|「回调」弹出窗口函数。|
     * |ajaxDownload|GET下载。|
     * |ajaxEager|「引擎」表格专用函数，提前执行Ajax读取执行数据渲染专用。|
     * |ajaxError|「回调」异常回调函数。|
     * |ajaxFetch|「非安全」GET读取远程数据。|
     * |ajaxGet|GET请求。|
     * |ajaxMessage|「回调」消息提示函数。|
     * |ajaxPost|POST请求。|
     * |ajaxPull|POST下载。|
     * |ajaxPush|「非安全」POST提交远程数据。|
     * |ajaxPut|PUT请求。|
     * |ajaxResource|「本地」当前站点，不带ENDPOINT的资源信息读取，一般读取HTML。|
     * |ajaxUpload|上传专用函数。|
     * |asyncAssist|Assist辅助数据异步调用函数。|
     * |asyncData|数据执行异步调用函数。|
     * |asyncMagic|解析`magic`节点配置专用异步调用函数。|
     * |asyncPromise|构造异步Promise专用。|
     * |asyncTrue|存在检查异步执行函数。|
     * |messageCatch|「回调」远程系统异常消息提示。|
     * |messageFailure|「回调」远程业务异常消息提示。|
     * |messageSuccess|「回调」成功消息提示。|
     * |microDelete|「微服务」DELETE请求。|
     * |microFetch|「微服务非安全」GET请求。|
     * |microGet|「微服务」GET请求。|
     * |microPost|「微服务」POST请求。|
     * |microPush|「微服务非安全」POST请求。|
     * |microPut|「微服务」PUT请求。|
     * |rxEdict|redux专用Ajax函数，执行Epic（遗留函数，后续也会使用，用于读取全局数据）|
     *
     * ## 1. 基础方法表格说明
     *
     * ### 1.1. Ajax方法说明
     *
     * |维度|安全|非安全|「微」安全|「微」非安全|
     * |:---|---|---|---|---|
     * |GET|ajaxGet|ajaxFetch|microGet|microFetch|
     * |POST|ajaxPost|ajaxPush|microPost|microPush|
     * |PUT|ajaxPut|（无）|microPut|（无）|
     * |DELETE|ajaxDelete|（无）|microDelete|（无）|
     *
     * > 非安全方法只支持GET和POST两种，而安全模式下会执行token的计算以及数字签名模式（为标准方法）。
     *
     * ### 1.2. 回调方法说明
     *
     * |维度|一阶|二阶|
     * |:---|---|---|
     * |窗口|ajaxDialog|ajax2Dialog|
     * |消息|ajaxMessage|ajax2Message|
     * |存在检查|（无）|ajax2True|
     * |异常|ajaxError|（无）|
     * |直接消息模式|messageSuccess, messageFailure, messageCatch|（无）|
     *
     * > 关于其他说明参考访问本身。
     *
     * @module _ajax
     */
    ...ajax,
    /**
     * # 开发调试模块
     *
     * 开发和调试专用模块，主要帮助开发生成不同日志。
     *
     * |函数名|说明|
     * |:---|:---|
     * |dgAjax|Ajax远程数据调试。|
     * |dgDebug|（高频）常用调试函数打印调试日志。|
     * |dgDiff|打印两个对象的比对差异结果。|
     * |dgFileJson|（高频）将数据对象存储成文件保存并下载。|
     * |dgGraphic|图引擎日志函数。|
     * |dgQuery|查询引擎日志函数。|
     * |dgRouter|路由日志函数。|
     * |dgTodo|待办标签函数。|
     * |fxError|构造错误对象专用函数。|
     * |fxFailure|Jsx输出型界面函数。|
     * |fxFatal|「中断」带中断错误抛出的中断执行函数。|
     * |fxMessage|构造错误消息专用函数。|
     * |fxRedux|Redux专用错误信息输出。|
     * |fxReject|「异步」异步专用错误信息输出函数。|
     * |fxReport|（废弃）直接打印彩色日志。|
     * |fxTerminal|console.error打印错误信息。|
     * |fxWarning|console.warn动因警告信息。|
     *
     * @module _develop
     *
     */
    ...develop,
    /**
     * # 值规范模块
     *
     * 值处理专用模块
     *
     * |函数名|说明|
     * |:---|:---|
     * |valueAppend|给某个对象追加字段信息，只追加没有的内容。|
     * |valueCopy|深度拷贝字段数据信息（支持嵌套）。|
     * |valueDuration|计算两个时间区间，根据不同单位返回，默认计算天。|
     * |valueEndTime|根据开始时间计算结束时间，默认天。|
     * |valueExpr|「内部用」解析表达式主体方法，用于执行表达式解析流程。|
     * |valueFabric|「引擎」字面量配置下的字典数据提取。|
     * |valueFabrics|「引擎」字面量配置下的字典数据提取，支持过滤器版本。|
     * |valueFactor|百分数转换成浮点数。|
     * |valueFind|值路径解析函数。|
     * |valueFloat|浮点数转换函数。|
     * |valueInt|整数转换函数。|
     * |valueLadder|「引擎」梯度处理函数。|
     * |valueLimit|「引擎」继承属性处理函数，移除fnOut,reference,config三个核心属性。|
     * |valueNow|读取当前时间，返回合法moment对象。|
     * |valueOnChange|「Web」自定义组件专用事件函数，生成onChange用。|
     * |valuePair|将表达式转换成Object对象，表达式格式`k1=v1,k2=v2,k3=v3,...`。|
     * |valueParse|将字符串`<type>:<expression>`解析成表达式配置对象。|
     * |valuePath|从Object中深度读取数据信息，可支持带.的模式。|
     * |valuePinyin|拼音转换函数。|
     * |valueRequest|「引擎」请求规范函数，自带`language, active, sigma`的值。|
     * |valueStartTime|根据结束时间计算开始时间，默认天。|
     * |valueTime|时间转换函数，将string转换成moment。|
     * |valueTimes|批量转换对象中的时间格式字段。|
     * |valueValid|移除所有undefined属性，支持宽度模式和非宽度模式。|
     *
     * @module _value
     *
     */
    /**
     * # 值转换模块
     *
     * 转换专用模块
     *
     * |函数名|说明|
     * |:---|:---|
     * |toArray|将输入数据转换成Array，统一转换。|
     * |toCss|转换类名为追加了Css前缀的类名。|
     * |toForm|「引擎」将两个表单配置合并到一起。|
     * |toGrid|「引擎」转换成grid的值，计算Css数据。|
     * |toGridSpan|「引擎」根据grid转换span的值。|
     * |toHeight|「标准」根据分辨率计算高度。|
     * |toHeightState|「标准」封装toHeight构造状态数据。|
     * |toJson|将数据转换成Json数据，JSON.parse。|
     * |toKey|计算Assist/Tabular的真实变量名。|
     * |toLimit|「引擎」继承属性限制函数，等价于`valueLimit`，在不同场景中使用。|
     * |toLink|`uri`字段转换函数，追加App对应的前缀path。|
     * |toLoading|延迟执行效果。|
     * |toLogout|「引擎」标准注销专用函数。|
     * |toMessage|构造Modal专用配置数据结构。|
     * |toOriginal|「引擎」返回原始路由地址，读取target数据并且执行react-router跳转到原始地址。|
     * |toPagination|「引擎」Table专用pagination转换函数，根据响应数据执行转换。|
     * |toPid|「引擎」菜单计算专用，Menu中的展开数据，防止F5刷新。|
     * |toQuery|「标准」读取查询uri路径上的参数信息。|
     * |toRoute|「引擎」根据react-router执行路由跳转。|
     * |toTime|时间转换函数，和valueTime不同的是toTime只做时间转换。|
     * |toTree|执行数组到树的转换（最终结果为树型的Array）。|
     * |toTreeArray|执行树类型的数组的转换（最终结果为拉平的Array）。|
     * |toTreeConfig|执行树配置信息的转换，转换成Tree的标准配置。|
     * |toWidth|字符串宽度计算。|
     * |toX|「引擎」列宽度计算，主要计算Table中的scroll.x的数据信息（列实时计算）。|
     *
     * @module _to
     *
     */
    /**
     * # 数组操作模块
     *
     * 值处理专用模块
     *
     * |函数名|说明|
     * |:---|:---|
     * |elementBranch|从当前节点查找所在分支的数组，父节点和祖辈（包含当前节点）。|
     * |elementChildren|在数组中查找当前节点所有子节点，构成子列表（Array）。|
     * |elementChildTree|在数组中查找当前节点所有子节点信息，构成子树。|
     * |elementFind|在数组中查找和`filters`匹配的元素构成子数组（Array）。|
     * |elementFindDatum|「引擎」带字典的elementFind。|
     * |elementFirst|返回数组的第一个元素或第一个元素中某个字段的值。|
     * |elementFlat|树拉平函数，构造时使用children作为子节点。|
     * |elementGrid|将Array转换成二维模型（矩阵模型）。|
     * |elementGroup|按某个字段对Array进行分组，每一组都是Array数据。|
     * |elementGroupDatum|「引擎」带字典的elementGroup。|
     * |elementIndex|查找某个元素在Array中的索引值。|
     * |elementJoin|连接两个Array按某个字段field连接到一起（合并+追加）。|
     * |elementMap|按某个字段将Array进行映射转换，field = Object的Map结构。|
     * |elementParent|查找所有父节点和祖辈（不包含当前节点）。|
     * |elementSave|不重复添加某个元素到Array数组中，以 field 为唯一键判定依据。|
     * |elementUnique|按 field = value 在数组中查找唯一元素，如果存在targetField则返回查找元素的某个字段数据。|
     * |elementUniqueDatum|「引擎」带字典的elementUnique，不支持targetField属性。|
     * |elementVertical|投影数组元素中某个字段生成新集合。|
     * |elementWrap|交换数组中两个索引位置的元素。|
     *
     * @module _element
     *
     */
    ...element,
    /**
     * # 解析器模块
     *
     * ## 1.函数列表
     *
     * |函数名|说明|
     * |:---|:---|
     * |aiExprAction|解析`action`表达式，用于解析带Confirm属性的按钮。|
     * |aiExprAjax|解析`ajax`表达式，用于解析Query类型的复杂表达式。|
     * |aiExprButton|解析`button`表达式，用于解析按钮专用属性`<Button/>`，处理Object类型。|
     * |aiExprButtons|批量Button解析，处理Array类型。|
     * |aiExprColumn|解析`column`表达式，用于解析Table中的列column对应的属性。|
     * |aiExprCommand|解析`command`表达式，用于解析命令元素，处理Object类型。|
     * |aiExprCommands|批量Command解析，处理Array类型。|
     * |aiExprDrawer|解析`drawer`表达式，「抽屉窗口」解析`<Drawer/>`元素配置。|
     * |aiExprField|解析`field`表达式，解析表单输入元素。|
     * |aiExprFieldEx|辅助`aiExprField`的扩展函数。|
     * |aiExprFilter|解析`filter`表达式，查询条件解析。|
     * |aiExprIcon|解析`icon`表达式，图标呈现配置解析。|
     * |aiExprOp|解析`op`表达式，解析标准按钮专用。|
     * |aiExprOption|解析`option`表达式，解析选项专用。|
     * |aiExprPopover|解析`popover`表达式，「浮游窗口」解析`<Popover/>`元素配置。|
     * |aiExprTabs|解析`tabs`表达式，「页签」解析`<Tabs/>`元素配置。|
     * |aiExprTitle|表单中的标题行专用解析器。|
     * |aiExprWindow|解析`window`表达式，「弹出窗口」解析`<Modal/>`元素配置。|
     * |applyArray|解析字符串或数组统一生成数组数据。|
     * |applyColumn|「引擎」解析表格`<Table/>`中的列配置。|
     * |applyConnect|「引擎」对存在connectId属性的配置执行`Ux.connectId`点击函数onClick执行注入。|
     * |applyItem|「引擎」表单字段解析函数。|
     * |applyKey|为配置项赋值，追加随机的`key`，如果不存在`key`时用uuid生成。|
     * |applyKv|如果出现`$KV$`表达式，则转换成对象，如：`k1=v1,k2=v2,...`。|
     * |applyLoading|防重复提交，追加`loading`属性。|
     * |applyRules|解析验证器`optionConfig.rules`的专用方法。|
     * |applyStyle|Style的解析，表达式如：`12px:#00000`，字体和颜色。|
     * |applyValue|如果对象没有value，则将key值赋值给value属性。|
     * |parseAjax|「引擎」Ajax参数解析函数。|
     * |parseField|「引擎」查询条件字段名称解析器，带符号，解析`field,op`格式。|
     * |parseInput|「引擎」请求数据专用解析流程，解析Object类型。|
     * |parseQuery|「引擎」查询条件解析。|
     * |parseValue|「引擎」解析`<TYPE>:<EXPR>`表达式提取值。|
     *
     * ## 2.关于$KV$的说明
     *
     * `$KV$`字段支持清单，它的格式通常是：`name1=value1,name2=value2`的格式，如果出现了逗号则使用"`"隔开。
     *
     * |属性名|目标节点|说明|
     * |:---|:---|:---|
     * |normalize|optionConfig.normalize|定义输入文本框的格式化、输入限制功能专用。|
     * |sorter|params.sorter|Ajax中排序参数字段。|
     * |inscribe|optionJsx.inscribe|当readOnly=true时需要显示成黑色的文字信息。|
     * |size|size|直接设置size属性，比如Ant中常用的size=`small | default | large`等。|
     * |shape|shape|直接设置shape属性，通常是`<Button/>`。|
     * |_submit|submit|直接设置submit属性，如`DIRECT | SUBMIT | SUBMIT_REDUX`等，主要用于按钮解析中的提交时间。|
     * |fixed|fixed|旧版布局专用属性，可设置fixed的值，特别是列渲染中，设置`left | right`等。|
     * |group|group|分组专用属性，可设置分组信息。|
     * |key|key|所有组件可用的主键值。|
     * |moment|moment|「boolean」设置布尔值，在表单字段中设置`moment=true`设置时间字段。|
     * |addonAfter|optionJsx.addonAfter|表单后置组件。|
     * |addonBefore|optionJsx.addonBefore|表单前置组件。|
     * |prefix|optionJsx.prefix|前置文字（支持图标）。|
     * |suffix|optionJsx.suffix|后置文字（支持图标）。|
     * |placeholder|optionJsx.placeholder|水印文字。|
     * |format|format|时间/日期专用格式。|
     * |valuePropName|optionConfig.valuePropName|CheckBox/Radio专用的Check属性。|
     * |withCredentials|optionJsx.withCredentials|上传组件安全凭证。|
     * |text|optionJsx.text|上传组件文字。|
     * |listType|optionJsx.listType|上传组件类型属性。|
     * |allowClear|optionJsx.allowClear|允许清除当前组件输入。|
     * |rows|optionJsx.rows|TextArea多文本组件的行属性。|
     * |maxLength|optionJsx.maxLength|输入框最大长度属性。|
     * |min|optionJsx.min|数值输入中限制的最小值。|
     * |max|optionJsx.max|数值输入中限制的最大值。|
     * |precision|optionJsx.precision|数值输入的精度属性。|
     * |step|optionJsx.step|数值输入的步进系数。|
     * |className|className|React组件专用className属性。|
     * |itemClass|optionItem.className|字段外层Item的className属性。|
     * |colon|optionItem.colon|表单字段是否带分号。|
     * |type|optionJsx.type|输入字段对应的类型信息。|
     * |showTime|optionJsx.showTime|DatePicker专用属性，是否显示时间。|
     * |mode|optionJsx.mode|时间日期面板专用的mode属性。|
     * |maxTagCount|optionJsx.maxTagCount|多选专用显示的最大数量。|
     * |autoFocus|optionJsx.autoFocus|自动焦点专用属性。|
     * |showSearch|optionJsx.showSearch|是否显示搜索框（自定义组件可用）。|
     * |labelSpan|optionItem.labelCol.span|标签宽度设置。|
     * |wrapperSpan|optionItem.wrapperCol.span|输入内容宽度设置。|
     * |readOnly|optionJsx.readOnly|只读设置。|
     * |disabled|optionJsx.disabled|禁用设置。|
     * |status|optionItem.status|自定义属性，用于设置不同状态下的界面状态设置。|
     *
     * ## 3.特殊属性特殊写法
     *
     * ### 3.1. normalize属性
     *
     * normalize属性用于限制输入信息，目前支持四种不同的格式，它的语法如：
     *
     * ```shell
     * normalize=<type>`<length>`<scale>
     * // type：限制输入类型
     * // length：限制长度
     * // scale：精度限制
     * ```
     *
     * 参考表格：
     *
     * |type|length|scale|含义|
     * |---:|---|---|:---|
     * |integer|8|x|只输入正整数。|
     * |number|8|x|只能输入数字。|
     * |length|8|x|只能输入长度为8的字符串。|
     * |decimal|8|2|只能输入2位浮点数。|
     *
     * @module _parser
     */
    /**
     * # 查询引擎模块
     *
     * 查询引擎模块，执行和查询引擎相关的语法。
     *
     * ## 1. 函数列表
     *
     * |函数名|说明|
     * |:---|:---|
     * |qrClear|清空$condition查询条件。|
     * |qrCombine|（参数传入）合并计算查询条件。|
     * |qrCommon|计算默认的query，此处执行合并计算，在很多组件中会直接使用。|
     * |qrComplex|（标准传入）以reference.state中的`$query,$condition,$filters`为基础计算最终查询条件。|
     * |qrForm|搜索表单提交数据构造。|
     * |qrInherit|继承查询条件专用的方法。|
     * |qrInput|这个方法主要用于**单值多字段**操作，基本搜索框的数据收集，如果`__DELETE__`则清空。|
     * |qrTerms|收集`<Table/>`配置的列配置中配置了`$filter`的列信息，列过滤定义数据存储。|
     *
     * ## 2. 查询引擎
     *
     * ### 2.1. 查询引擎语法
     *
     * 该查询引擎语法是遵循Zero中的查询引擎语法，参数的基础结构如：
     *
     * ```json
     * {
     *     "criteria":{
     *     },
     *     "pager":{
     *         "page":1,
     *         "size":10
     *     },
     *     "sorter":[
     *         "name,DESC"
     *     ],
     *     "projection":[]
     * }
     * ```
     *
     * * criteria：查询条件（查询树语法）
     * * pager：分页参数，从第一页开始（page = 1）
     * * sorter：排序，数组格式，支持多字段优先排序
     * * projection：列过滤
     *
     * ### 2.2. 查询条件基本语法
     *
     * ```json
     * {
     *     "field,op": "value",
     *     "related.field,op": "value"
     * }
     * ```
     *
     * * `field,op`表示直接字段和OP操作符。
     * * `related.field,op`表示关联字段和OP操作符（二级嵌套对象）。
     *
     * ### 2.3. OP操作符
     *
     * |操作符|JSON键值格式|说明|SQL条件|
     * |:---|:---|:---|:---|
     * | &lt; | "age,&lt;":20 | 小于某个值 | AGE &lt; 20 |
     * | &lt;= | "age,&lt;=":20 | 小于等于某个值 | AGE &lt; 20 |
     * | &gt; | "age,&gt;":16 | 大于某个值 | AGE &gt;= 16 |
     * | &gt;= | "age,&gt;=":16 | 大于等于某个值 | AGE &gt;= 16 |
     * | = | "age,=":12 或 "age":12 | 等于某个值 | AGE = 12 |
     * | &lt;&gt; | "name,&lt;&gt;":"LANG" | 不等于 | NAME &lt;&gt; 'LANG' |
     * | !n | "name,!n":"随意" | 不为空 | NAME IS NOT NULL |
     * | n | "name,n":"随意" | 为空 | NAME IS NULL |
     * | t | "active,t":"随意" | 等于TRUE | NAME = TRUE |
     * | f | "active,f":"随意" | 等于FALSE | NAME = FALSE |
     * | i | "name,i":\["A","B"\] | 在某些值内 | NAME IN \('A','B'\) |
     * | !i | "name,!i":\["C","D"\] | 不在某些值内 | NAME NOT IN\('A','B'\) |
     * | s | "name,s":"Lang" | 以某个值开始 | NAME LIKE 'Lang%' |
     * | e | "name,e":"Lang" | 以某个值结束 | NAME LIKE '%Lang' |
     * | c | "name,c":"Lang" | 模糊匹配 | NAME LIKE '%Lang%' |
     *
     * ### 2.4. 连接符
     *
     * 查询引擎中的同一级数据中通过`""`键值来判断是AND还是OR操作符。
     *
     * |键|值|连接符|
     * |:---|:---|:---|
     * |""|true|AND（默认值，或不写）|
     * |""|false|OR|
     *
     * ### 2.5. 例子
     *
     * #### 简单例子
     *
     * ```json
     * {
     *      "age,>":16,
     *      "active,f":"$0"
     * }
     * ```
     *
     * 对应的SQL语法：
     *
     * ```sql
     * AGE > 16 AND ACTIVE = FALSE
     * ```
     *
     * #### 复杂例子
     *
     * ```json
     * {
     *      "active,f":"$0",
     *      "":false,
     *      "$0":{
     *          "name,s":"Duplicated",
     *          "active,t":"$1"
     *      }
     * }
     * ```
     *
     * 对应的SQL语法：
     *
     * ```sql
     * ACTIVE = FALSE OR (NAME LIKE 'Duplicated%' AND ACTIVE=TRUE)
     * ```
     *
     * @module _qr
     */
    /**
     * # 界面模块
     *
     * ## 1. 函数列表
     *
     * |函数名|特征|说明|
     * |:---|:---|:---|
     * |activeColumn|Trigger|触发`__BTN_CLEAR_<X>`元素的onClick事件。|
     * |activeSearch|Trigger|触发`__BTN_CLEAR_SEARCH`元素的onClick事件。|
     * |activeTreeOff|Trigger|触发`__BTN_TREE_OFF`元素的onClick事件。|
     * |activeTreeOn|Trigger|触发`__BTN_TREE_ON`元素的onClick事件。|
     * |anchorColumn|Jsx|生成`__BTN_CLEAR_<X>`模式的隐藏按钮，被外围按钮调`connectId`链接。|
     * |anchorSearch|Jsx|生成`__BTN_CLEAR_SEARCH`用于清除搜索条件专用隐藏条件。|
     * |anchorTree|Jsx|生成`__BTN_TREE_OFF`和`__BTN_TREE_ON`树启用禁用菜单。|
     * |columnWrapper|Column|生成render专用函数`(text,record,index) => ...`，结合上层配置生成可执行render。|
     * |formAdvReset|Form|「引擎」formReset的增强版。|
     * |formClear|Form|清空表单专用，配合`$clear`配置执行清空操作，该变量提供了需要清空的字段配置信息。|
     * |formGet|Form|「读多值」根据提供的`key`值读取表单中的数据，如果是多个`key`则读取Object，如果单个则读取单个字段数据。|
     * |formHit|Form|「读写单值」二义性函数，读取某个字段或设置某个字段的值。|
     * |formHits|Form|「写多值」批量设置值操作，将一个Object的值设置到表单中。|
     * |formLinker|Form|`ListSelector,TreeSelector`中专用处理`linker`的特殊方法。|
     * |formRead|Form|（主要用于父表单数据读取）如果包含了`$record`则从中读取数据，否则直接读取完整的表单数据。|
     * |formRedo|Form|防重复加载重置。|
     * |formReset|Form|「重置」表单标准的重置操作，触发reset按钮。|
     * |formSubmit|Form|「提交」异步提交表单专用方法。|
     * |htmlDisabled|Html|读取HTML元素的disabled属性。|
     * |htmlErrorBlur|Html|触发onBlur的错误信息专用函数。|
     * |htmlErrorFocus|Html|触发onFocus的错误信息专用函数。|
     * |htmlReadOnly|Html|读取HTML元素的readOnly属性。|
     * |onConfirm|On|封装Confirm弹出框的`确认/取消`的onClick事件操作。|
     * |onDatum|On|「继承」非事件，属性继承专用，处理Assist/Tabular类型的属性集。|
     * |onLinker|On|linker配置数据的专用处理方法，ListSelector/TreeSelector都可能用到。|
     * |onReference|On|「引擎」（高频）向上递归读取props中的`reference`引用（父组件引用）。|
     * |onRouter|On|「引擎」从React Router中读取路由参数（包括QueryString中的参数）。|
     * |onSave|On|DATUM相关字典数据的合并专用操作，应用于很多带有字典类型的表单提交中。|
     * |onUniform|On|「继承」非事件，属性继承专用，读取`$app, $user, $profile, $router, $parent, $submitting`等统一属性。|
     * |writeDisabled|Jsx|表单字段的disabled全计算（依赖、Acl、其他等）。|
     * |writeImpact|Jsx|表单中的impact配置影响全计算，计算被影响字段状态。|
     * |writeInitial|Jsx|当disabled为true时，书写特定初始值到jsx属性中（data-initial）。|
     * |writeLinker|Jsx|linker计算过程，用于读取初始化加载过的linker数据，完成引用渲染。|
     * |writeReadOnly|Jsx|表单字段的readOnly权计算（依赖、Acl、其他等）。|
     * |writeSegment|Jsx|「总控」表单计算的特殊方法。|
     *
     * @module _ui
     */
    /**
     * # 核心引擎模块
     *
     * ## 1. 函数列表
     *
     * |函数名|说明|
     * |:---|:---|
     * |cabQuery|读取query参数，通常用于`<ListXXX/>`组件，`_grid -> query`执行qrCombine合并。|
     * |capForm|（最复杂的配置执行）表单配置初始化。|
     * |capTab|`<Tabs/>`组件配置初始化专用，构造`state.$tabs`节点信息，构造状态数据。|
     * |configAnchor|双锚点专用函数，对应锚点生成按钮，这些按钮全是隐藏按钮，可被`connectId`触发。|
     * |configColumn|（高频）表格列主配置方法：`<Table/>`中的列配置专用。|
     * |configDialog|（高频）窗口主配置方法：`<Modal/>`的核心配置。|
     * |configExecutor|（组件专用）内置组件专用$executor配置程序，配置表格列操作。|
     * |configExecutors|「2阶」（编程专用）编程过程中专用的配置程序，配置表格列操作。|
     * |configForm|表单配置主方法，处理表单配置信息专用。|
     * |configScroll|计算表格宽度专用（是否包含滚动条处理）。|
     * |configTab|`<Tabs/>`组件专用配置执行程序。|
     * |configTable|`<Table/>`组件专用配置主程序。|
     * |createAction|redux-act构造Redux的Action专用核心函数。|
     * |dataIn|redux中的数据输入，创建DataIn。|
     * |dataOut|redux中的数据输出，创建DataOut。|
     * |fnOut|专用全局redux的store修改函数（统一使用一个函数和不同数据结构执行）。|
     * |fromHoc|读取资源文件中（`src/cab/cn/`）的数据信息，只读取根节点。|
     * |fromPath|读取资源文件中的某个路径下的数据信息。|
     * |raftForm|「遗留」内部调用函数，只在`@zero`中执行的表单配置构造。|
     * |rjAssist|「2阶」Assist专用redux对应的ajax构造，生成函数，简化构造流程，内部调用rxAssist。|
     * |rjTabular|「2阶」Tabular专用redux对应的ajax构造，生成函数，简化构造流程，内部调用rxDatum。|
     * |rxAssist|执行Assist响应数据的计算（主要针对Array和Object.list的合并运算。|
     * |rxCheckedRow|执行`<Table/>`中的选择行数据的专用选择方法。|
     * |rxCheckedTree|执行`<Tree/>`中的选择树相关数据的专用选择方法。|
     * |rxDatum|执行Tabular响应数据的计算（支持分组功能，最终生成Assist级别的数据。|
     * |rxEtat|「主」资源文件绑定主方法。|
     * |rxFlow|「主」综合构造组件之前的Ajax链式结构（redux模式）。|
     * |rxInit|「遗留」新版本不再使用zxInit函数，目前只在container遗留系统中使用。|
     * |rxResize|执行浏览器界面的resize注入专用方法。|
     * |storeApp|「引擎」存储应用程序到LocalStorage中。|
     * |storeUser|「引擎」存储登录数据到SessionStorage中。|
     * |writeAssist|写数据到redux树中的assist节点。|
     * |writeClean|清除redux树上的默认常用核心信息。|
     * |writeSubmit|写入状态数据到redux树上实现跨组件、节点、页面的防重复提交状态信息。|
     * |writeTree|书写数据到`assist/tabular`两个节点中。|
     *
     * ## 2. 特殊查询参数
     *
     * Zero Ui中包含了默认使用的一些查询参数信息，这些参数会使用Base64进行编码解码。
     *
     * `/xxx/yyy?<p1>=<v1>&<p2>=<v2>&....`
     *
     * |参数名|含义|
     * |---|:---|
     * |mid|Menu主键（主菜单参数值）|
     * |pid|Page主键（页面参数值，二级菜单主键）|
     * |target|callback专用，登录页面使用该参数在登录过程中可直接调用`Ux.toOriginal`返回到target指定页面。|
     *
     * @module _engine
     */
    /**
     * # Jsx渲染模块
     *
     * Jsx渲染专用模块（等待补充）
     *
     * ## 1. 函数列表
     *
     * |函数名|说明|
     * |:---|:---|
     * |aiBreadcrumb|面包屑渲染。|
     * |aiLink|渲染单个链接。|
     * |aiUrl|计算链接最终地址。|
     *
     * @module web-ai
     **/
    ...engine,
    ...entity,


    /**
     * # 插件模块
     *
     * 插件专用模块
     *
     * ## 1. 函数列表
     *
     * |函数名|说明|
     * |:---|:---|
     * |pluginEdition|检查`$plugins`中的pluginForm属性来计算表单的三态（可编辑、只读，带Acl），标准编辑。|
     * |pluginField|检查`$plugins`中的pluginField属性来计算表单的三态（可编辑、只读，带Acl），字段编辑。|
     * |pluginForm|串联执行`pluginEdition`，然后执行`pluginField`，而阶段操作（表单全生命周期）。|
     * |pluginMetadata|专用记录数据检查`pluginMetadata`，检查metadata字段。|
     * |pluginOp|行操作过程中的限制处理，主要调用`pluginRow`函数。|
     * |pluginSelection|多选框单独计算，根据可编辑和可删除来计算多选框是否存在，同样调用`pluginRow`函数。|
     *
     * ## 2. 关于插件
     *
     * 插件本身是从插件包中读取的：
     *
     * ```js
     * import Plugin from "plugin";
     * ```
     *
     * 而整个流程中不同的插件应用于不同位置。
     *
     * ## 3. 编辑控制
     *
     * ### 3.1. pluginOp/pluginSelection
     *
     * 这两个函数主要用于处理列表中的行状态信息：
     *
     * 1. pluginOp：计算当前行是否存在**编辑，删除**两种核心权限。
     * 2. pluginSelection：根据当前行存在的两种核心权限计算批量操作。
     * 3. 这两个函数内置调用都是调用了`pluginRow`专用函数。
     *
     * ### 3.2. pluginForm合并
     *
     * 标准表单流程中，pluginForm调用了两个核心函数（一前一后）
     *
     * 1. pluginEdition：先行处理。
     * 2. pluginField：在计算完成后调用该函数执行继续计算（有编辑权限时计算）。
     * 3. pluginMetadata：最后计算记录本身的状态信息。
     *
     * ### 3.3. pluginMetadata检查
     *
     * 以数据记录为主，检查`metadata`字段：
     *
     * ```json
     * {
     *     "edition": "可编辑",
     *     "deletion": "可删除"
     * }
     * ```
     *
     * ### 3.4. 转换
     *
     * 行操作过程中的`pluginRow`最终会转换成详细页面中的`pluginForm`，因为二者存在依赖控制
     *
     * 1. 如果行操作不可编辑，那么详细页中的表单也会是不可编辑（高级控制）
     * 2. 如果行操作不可删除，那么详细页中的表单也会变成记录不可删除
     *
     * 这种依赖关系通过插件来完成。
     *
     * ## 4. 插件包中有空代码
     *
     * ```js
     * {
     *     Function: {},
     *     Extension: {},
     *     pluginField: (ref) => (record, reference) => {
     *          const $edition = {};
     *          return $edition;
     *     }
     * }
     * ```
     *
     * 三个主键的含义如下：
     *
     *
     * |函数名|说明|
     * |:---|:---|
     * |Function|针对单字段的相关配置，处理插件流程，比如导出、审批等。|
     * |Extension|插件组件设置（特定插件组件，如ExApprovalBatch，ExEditorBatch）。|
     * |pluginField|特定函数，执行pluginField操作（透过扩展来完成字段控制）。|
     *
     * > 目前这部分内容属于外挂hook型，后续还有待升级，并未严格测试。
     *
     * @module _plugin
     */



    /**
     * # 工具函数模块
     *
     * ## 1. 函数列表
     *
     * |函数名|特征|说明|
     * |:---|:---|:---|
     * |ambArray|Ambiguity|二义性Array转换，将`...arguments`和`Array`同时转换成统一的Array结构（原型链应用）。|
     * |ambEvent|Ambiguity|二义性Event数据读取，要么读取`event.target.value`，要么直接取值（如Select等）。|
     * |ambFind|Ambiguity|从`field=key`的变量中提取字段`name`的值，变量可以是Object类型，也可以是DataObject类型。|
     * |ambKv|Ambiguity|二义性遍历函数，如果是Object，则执行`field=value`，如果是Array，针对每一个元素执行`field=value`。|
     * |ambObject|Ambiguity|二义性对象函数，只读取Object，先reference.props，再reference.state。|
     * |ambValue|Ambiguity|二义性值函数，可读取所有数据，先reference.props，再reference.state。|
     * |connectId|Connect|（高频）触发id的`onClick`方法，用于远程执行函数。|
     * |connectItem|Connect|修饰表单`<Form.Item/>`的验证效果。|
     * |connectRenders|Connect|计算当前optionJsx中的`$renders`渲染函数。|
     * |connectValidator|Connect|为Form字段连接验证器专用，包括设置触发模式`validateTrigger`。|
     * |decryptBase64|Encrypt|Base64解码字符串。|
     * |dslArray|Dsl|存储Array专用数据结构，根据配置执行操作结果，DataArray专用操作。|
     * |encryptAES|Encrypt|AES加密字符串。|
     * |encryptBase64|Encrypt|Base64编码字符串。|
     * |encryptHmac512|Encrypt|Hmac512加密字符串（数字签名用）。|
     * |encryptMD5|Encrypt|MD5加密字符串（密码加密用）。|
     * |forest|Tree|森林数组计算。|
     * |forestGroup|Tree|分组森林数组计算。|
     * |formatCurrency|Format|货币格式化。|
     * |formatDate|Format|日期时间值格式化成可呈现的时间字符串。|
     * |formatExpr|Format|表达式格式化，可执行`:name/:name1/test`的格式化操作，保留或移除参数。|
     * |formatNow|Format|格式化当前日期时间值。|
     * |formatObject|Format|将字符串转换成对象，近似于`valueKv`操作，如果提供第二参则执行`key`的追加。|
     * |formatPercent|Format|将值格式化成百分数。|
     * |formatQuery|Format|构造查询字符串`<uri>?<p1>=<v1>&<p2>=<v2>`的最终链接。|
     * |formatTpl|Format|数据模板填充专用方法，可递归填充。|
     * |mathDiscount|Math|折扣计算，将小数转换成常用的`n折，n.n折`的n值。|
     * |mathDivision|Math|数值计算除法，0除会抛异常。|
     * |mathMultiplication|Math|数值计算乘法，可支持多个乘数构造最终结果，防止NaN值出现。|
     * |mathSum|Math|（只支持整数）数值计算加法。|
     * |randomArray|Random|从Array中随机抽取某个元素。|
     * |randomInteger|Random|生成随机整数。|
     * |randomString|Random|生成随机长度的随机字符串。|
     * |randomUUID|Random|生成UUID值。|
     * |sorterAsc|Sorter|字典序顺序排列，字符串类型。|
     * |sorterAscD|Sorter|字典序顺序排列，时间类型。|
     * |sorterAscDFn|Sorter|「2阶」sorterAscD的2阶。|
     * |sorterAscFn|Sorter|「2阶」sorterAsc的2阶。|
     * |sorterAscT|Sorter|广义类型顺序排列。|
     * |sorterAscTFn|Sorter|「2阶」sorterAscT的2阶。|
     * |sorterDesc|Sorter|字典序逆序排列，字符串类型。|
     * |sorterDescD|Sorter|字典序逆序排列，时间类型。|
     * |sorterDescDFn|Sorter|「2阶」sorterDescD的2阶。|
     * |sorterDescFn|Sorter|「2阶」sorterDesc的2阶。|
     * |sorterDescT|Sorter|广义类型逆序排列。|
     * |sorterDescTFn|Sorter|「2阶」sorterDescT的2阶。|
     * |sorterObject|Sorter|对Object中的键值对进行字典序排列。|
     * |tree|Tree|构造内置树结构，可构造树容器。|
     * |treeChildren|Tree|选择直接子节点。|
     * |treeChildrenAll|Tree|选择所有子节点（孙子辈但不包括自身）。|
     * |treeChildrenAllIn|Tree|选择所有子节点（孙子辈并包括自身）。|
     * |treeFlip|Tree|构造树的显示信息，最终生成`root/level1/level2`的结构。|
     * |treeParent|Tree|选择直接父节点。|
     * |treeParentAll|Tree|选择所有父节点（祖辈但不包括自身）。|
     * |treeParentAllIn|Tree|选择所有父节点（祖辈并包括自身）。|
     * |treeShared|Tree|计算最大公约树（计算共享子树）。|
     *
     * @module _unity
     */
    ...unity,

    ...g6,
    ...g2,


    /**
     * # 自定义Web组件模块
     *
     * 该部分的所有API为自定义Web组件模块专用，自定义组件位于`economy`目录中。
     *
     *
     * ## 1. 函数列表
     *
     * |函数名|说明|
     * |:---|:---|
     * |xtChecked|可选择组件的多选专用计算。|
     * |xtExprFlat|（内部）构造表达式数据，传入Object，针对Object中所有配置执行解析，得到最终的定义型Array。|
     * |xtFormat|多格式计算，**二维编辑器**（如TableEditor）专用。|
     * |xtGet|根据配置信息读取自定义组件中的值。|
     * |xtInitArray|多义处理Array类型，任何输入转换成数组。|
     * |xtInitArrayMap|多义处理Array类型，生成Map类型（分组，每组一条）。|
     * |xtInitFormat|广义初始化（根据format判断，多格式处理）。|
     * |xtInitObject|多义处理Object类型，任何输入转换成对象。|
     * |xtLazyAjax|带ajax配置（config.ajax）的延迟加载Ajax配置型组件，支持Qr模式。|
     * |xtLazyData|带ajax配置的组件的Promise回调的执行函数。|
     * |xtLazyUp|「生命周期」带ajax配置型的组件componentDidUpdate方法专用更新方法，若包含form则拥有form级的判断。|
     * |xtLazyInit|「生命周期」带ajax配置型的组件componentDidMount方法专用初始化方法。|
     * |xtReady|（带Loading）判断`$ready`专用的render准备方法，Ex中使用`yoRender`，而自定义组件中使用`xtReady`。|
     * |xtRender|（不带Loading），和xtReady对应，带error渲染。|
     * |xtReset|Ant Design中的Form的RESET方法专用操作，可重置上层表单，主要应用于allowClear属性。|
     * |xtRevert|注意区分xtReset，xtRevert是恢复默认过程中使用，xtReset是提交完成后执行。|
     * |xtRowAdd|「事件函数」表格行添加事件函数。|
     * |xtRowChange|「事件函数」注入行onChange方法专用函数。|
     * |xtRowDel|「事件函数」表格行删除事件函数。|
     * |xtSet|xtGet的逆方法，用于设置值。|
     * |xtUnsafe|「生命周期」UNSAFE_componentWillReceiveProps专用自定义钩子方法。|
     *
     * ## 2. 格式配置表
     *
     * ### 2.1. optionJsx中的配置数据：
     *
     * ```json
     * {
     *     "optionJsx":{
     *         "format": {
     *             "type": "可支持的类型",
     *             "keyField": "主键字段"
     *         }
     *     }
     * }
     * ```
     *
     * ### 2.2. format中的type
     *
     * |type值|说明|抛异常|
     * |---|:---|---|
     * |OBJECT|只支持Object类型。|Array和undefined抛异常|
     * |ARRAY|Array和undefined类型。|其他类型|
     * |ARRAY_MAP|使用单字段分组执行（元素为Object）。|x|
     * |ARRAY_PURE|使用索引执行内置数据。|x|
     * |ARRAY_GROUP|使用单字段分组执行（元素为Array）。|x|
     *
     *
     * ## 3. 自定义模块
     *
     * `_xweb`模块的所有API只在自定义组件中使用，使用过程可调用底层的Ux函数，有了这些函数的帮助，可顺利完成很多复杂自定义组件
     * 所需的任务。
     *
     * * 多格式支持
     * * 二维表编辑
     * * 事件生成函数
     * * Form表单绑定执行
     * * 初始化/更新生命周期执行
     * * 带Ajax的远程延迟加载
     *
     * @module _xweb
     */
    ...xweb,


    /**
     * # 多义性模块
     *
     * 该模块为后期封装型模块，为开发人员提供**多义性操作**快速开发专用API。
     *
     * ## 1. 函数列表
     *
     * |函数名|说明|
     * |:---|:---|
     * |sexBatch|「引擎」批量操作生成专用代码，处理批量选择专用的`$selected`变量。|
     * |sexCab|「引擎」（高频）资源文件合并读取专用方法（三配置数据源）。|
     * |sexDialog|「引擎」（高频）专用回调方法，弹出框专用（Modal），一般在Ajax调用之后执行。|
     * |sexIdentifier|「引擎」配置模块读取identifier模型标识符专用（多源头读取）。|
     * |sexMessage|「引擎」（高频）专用回调方法，全局消息专用（message），一般在Ajax调用之后执行。|
     * |sexModal|「引擎」Web渲染，`<DialogButton/>`按钮渲染专用方法，按钮中包含了子组件。|
     * |sexOp|「引擎」事件绑定专用函数，用于绑定传入的events对象中的Op事件信息。|
     * |sexTable|「引擎」表格组件`<Table/>`专用配置，不带事件执行配置表格。|
     *
     * @module _romantic
     */
    ...romantic,


    /**
     * # 常量模块
     *
     * ## 1.基本说明
     *
     * 常量的直接调用方式，所有的常量直接存储在`Ux.Env`对象中，可执行下边的代码调用。
     *
     * ```js
     * import Ux from 'ux';
     *
     * const value = Ux.Env.xxx
     * // 如 `Z_ENTRY_LOGIN` 环境变量，直接调用时写法为：`Ux.Env.ENTRY_LOGIN` 方式。
     * ```
     *
     * 系统的环境变量定义在下边两个文件中：
     *
     * * `.env.development`：开发环境专用环境变量，process.env.NODE_ENV 值为 development
     * * `.env.production`：生产环境专用环境变量，process.env.NODE_ENV 值为 production
     *
     * ## 2.环境变量
     *
     * ### 2.1.默认变量
     *
     * |变量名|调用|说明|
     * |:---|:---|:---|
     * |PORT|（无）|当前前端运行的端口号，默认3000。｜
     * |HOST|（无）|当前前端运行的HOST地址，默认无值。|
     * |REACT_APP_LESS_MODULES|（无）|在REACT中使用模块化的less。|
     *
     * ### 2.2.框架变量
     *
     * 环境变量名在调用时需去掉`Z_`前缀，参考上边的代码Demo，且只有`Z_`前缀环境变量可如此调用，环境变量说明可参考下边表格：
     *
     * |变量名|调用|说明|
     * |:---|:---|:---|
     * |Z_TITLE|`Ux.Env.TITLE`|当前运行环境的标题，最终会应用于`HTML`的`<header>`部分，目前可能存在BUG。|
     * |Z_APP|`Ux.Env.APP`|当前应用的名称，该名称在extension中存储于 `X_APP` 表，实现多应用平台，也可连接配置中心，为当前前端应用的唯一标识符。|
     * |Z_ENDPOINT|`Ux.Env.ENDPOINT`|当前端环境要访问后端远程时，使用该环境变量配置后端的endpoint地址，实现前后端分离访问。|
     * |Z_LANGUAGE|`Ux.Env.LANGUAGE`|多语言环境，默认环境值为`cn`，该值会让前端访问`src/cab/cn`目录下的资源文件（多语言前端），并且设置`X_LANG`为中文环境。|
     * |Z_ROUTE|`Ux.Env.ROUTE`|当前前端运行的动态路由根路径，不同应用该值设置为不同，也可和配置中心连接，react-router自动化脚本以此为根路径。|
     * |Z_K_SESSION|（无）|当前应用在SessionStorage时对应的前缀值，默认使用`@@ZUI/`为该前缀，同一个浏览器中可拥有不同的应用，并且不会产生数据冲突。|
     * ||`Ux.Env.KEY_APP`|保存当前应用专用键值，不同键值表示不同应用，存储在SessionStorage中。|
     * ||`Ux.Env.KEY_USER`|保存当前登录用户信息专用键值，不同用户使用不同键值，存储在SessionStorage中。|
     * |Z_K_EVENT|`Ux.Env.KEY_EVENT`|当前应用使用的redux专用事件前缀，区分不同redux行为专用，默认值`@@ZUI-ACT`。|
     * |Z_CORS_MODE|`Ux.Env.CORS_MODE`|（安全）解决跨域过程中的选项，对应fetch中的options值：cors,no-cors或其他。|
     * |Z_CORS_CREDENTIALS|`Ux.Env.CORS_CREDENTIALS`|（安全）对应options中的credentials选项，包括：include,omit或其他。|
     * |Z_SIGN|`Ux.Env.SIGN`|（安全）是否启用数据签名功能，针对古老REST专用，默认值false。|
     * |Z_SECRET_AES|`Ux.Env.SECRET_AES`|（安全）使用AES加密时该应用的专用secret值，不同应用可发放不同值。|
     * |Z_PLUGIN|`Ux.Env.PLUGIN`|是否启用插件环境，启用插件环境才可用`plugin`包中的内容。|
     * |Z_SHARED|`Ux.Env.SHARED`|全局Epic/Types共享目录名，默认为app，不同应用使用的目录不同，共享目录位于：`src/app/action`下。|
     * |Z_ENTRY_LOGIN|`Ux.Env.ENTRY_LOGIN`|（页面）当前应用的登陆首页，入口页面。|
     * |Z_ENTRY_ADMIN|`Ux.Env.ENTRY_ADMIN`|（页面）当前应用的管理首页，主页面。|
     * |Z_X_HEADER_SUPPORT|（无）|启用不同应用变量：`X-Sigma，X-AppId, X-AppKey, X-Lang`实现多租户、多语言、多应用的平台环境。|
     * |Z_CSS_PREFIX|`Ux.Env.CSS_PREFIX`|（风格）当前站点的风格文件前缀，对应less中的前缀，全局变量`@app`，禁用值：`ux,ox,ex,web`等。|
     * |Z_CSS_COLOR|`Ux.Env.CSS_COLOR`|（风格）当前站点的主色调，一旦改动这个颜色，那么主体色调会被改变，对应antd中的`@primary-color`的值。|
     * |Z_CSS_FONT|`Ux.Env.CSS_FONT`|（风格）当前站点的默认字体大小，默认值14px。|
     *
     * ### 2.3.开发变量
     *
     * |变量名|调用|说明|
     * |:---|:---|:---|
     * |Z_DEV_DEBUG|`Ux.Env.DEBUG`|是否开启调试模式，调试模式只有在开发环境中生效，development/production。|
     * |Z_DEV_MOCK|`Ux.Env.MOCK`|是否打开全局MOCK功能，如果打开则可支持直接使用纯前端模式。|
     * |Z_DEV_FORM||监控表单渲染的专用变量，牵涉到表单布局的渲染流程。|
     * |Z_DEV_MONITOR|`Ux.Env.MONITOR`|（Deprecated）是否启用Zero UI中的原生监控工具，可直接使用一个浮游工具栏。|
     * |Z_DEV_AJAX|`Ux.Env.DEBUG_AJAX`|是否将Ajax请求保存成json文件格式，如果调试模式打开，则Request会保存成json格式方便开发。|
     *
     * ## 3.内部定义常量
     *
     * 除开上述环境变量以外，系统中还包含了部分系统定义常量，定义的常量参考剩余的常量文档部分（略）。
     *
     * ## 4.示例
     *
     * 参考下边的`.env.development`文件内容：
     *
     * ```properties
     * PORT=5000
     * Z_TITLE=配置管理平台
     * Z_LANGUAGE=cn
     * Z_ENDPOINT=http://ox.engine.cn:6083
     * Z_APP=vie.app.ox
     * Z_ROUTE=ox
     * Z_SHARED=app
     * Z_ENTRY_LOGIN=/login/index
     * Z_ENTRY_ADMIN=/main/index
     * Z_PLUGIN=true
     * Z_K_SESSION=@@OX/
     * Z_K_EVENT=@@OX-ACT
     * REACT_APP_LESS_MODULES=true
     *
     * Z_DEV_DEBUG=true
     * Z_DEV_MOCK=true
     * Z_DEV_AJAX=false
     * Z_DEV_FORM=true
     * Z_DEV_MONITOR=false
     *
     * Z_CSS_PREFIX=ox
     * Z_CSS_COLOR=#3d8ce7
     * Z_CSS_FONT=13px
     * Z_CORS_CREDENTIALS=include
     *
     * Z_X_HEADER_SUPPORT=true
     * ```
     *
     * @module _constant
     *
     */
    Env: {
        ...constant,
    },
    E,
};
console.warn(exported);
export default exported;

