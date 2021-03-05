import Tpl from './tpl';
import Yi from './yi';
import Yu from './yu';
import Yo from './yo';

/**
 * # 核心通道模块
 *
 * `y`系列通道专用方法，Zero Extension中最大的亮点。
 *
 * |函数前缀|说明|含义|
 * |---|:---|:---|
 * |yi|状态执行函数，componentDidMount中调用|yi - 嗨，i - initialize|
 * |yo|渲染执行函数，render中调用|yo - 哟，o - origin|
 * |yu|更新专用函数，componentDidUpdate中调用|yu - 唷，u - update|
 * |yl|加载型容器函数，$ready的检查|yl - 加载，l - loading|
 *
 * ## 1. 函数列表
 *
 * |函数名|含义|
 * |:---|:---|
 * |yiAssist|在state中注入Assist辅助数据节点`$t_`和`$a_`前缀。|
 * |yiColumn|表格组件的列配置信息中，预处理`$render = USER`的Ajax辅助数据列（性能提升版本，预读取）。|
 * |yiCompany|为查询引擎追加`companyId,=`的公司条件。|
 * |yiControl|「页面+控件」单个控件专用的控件配置初始化函数。|
 * |yiLayout|「容器+控件」单个页面初始化配置的专用函数，包括计算布局相关信息。|
 * |yiModule|读取模块配置，静态存储于后端的某个JSON文件，动态则存储于`X_MODULE`表中。|
 * |yiPartForm|区域表单初始化，等价于原始的`yiForm`，但由于配置数据来源于不同存储位置，所以重命名为yiPartForm替代。|
 * |yiStandard|标准页面渲染专用（静态开发模式）。|
 * |ylCard|带$ready的PageCard简化版。|
 * |ylDynamic|带$ready的PageCard（支持远程读取配置）简化版。|
 * |yoAction|五个按钮区域的属性继承函数。|
 * |yoAmbient|「高频」统一调用的属性继承函数，几乎每个组件都会使用。|
 * |yoComponent|yoAmbient的别名函数。|
 * |yoControl|动态渲染中的每个控件专用的属性继承函数。|
 * |yoDynamic|表单的`$inited`专用处理二义性属性继承函数。|
 * |yoFilter|查询表单专用属性继承函数。|
 * |yoForm|标准表单专用继承函数。|
 * |yoFormAdd|「ExListXxx」列表内部专用添加表单属性继承函数。|
 * |yoFormEdit|「ExListXxx」列表内部专用编辑表单属性继承函数。|
 * |yoList|「ExListXxx」列表组件属性继承函数。|
 * |yoListBatch|「ExListXxx」Batch批量区域操作属性继承函数。|
 * |yoListExtra|「ExListXxx」Extra附加区域操作属性继承函数。|
 * |yoListOpen|「ExListXxx」Open添加区域操作属性继承函数。|
 * |yoListSearch|「ExListXxx」Search区域基础搜索和高级搜索工具栏属性继承函数。|
 * |yoRender|组件专用检查是否加载完成的函数，`$ready`标记检查。|
 * |yoTabExtra|`<Tabs/>`中附加区域属性继承函数，通常在添加表单/编辑表单页签。|
 * |yoTable|`<Table/>`表格组件专用属性继承函数，ExListXxx共享。|
 * |yoTabPage|`<Tabs.Pane/>`页签中每一页的属性继承函数。|
 * |yuCondition|`$condition`查询条件更新检查函数。|
 * |yuDirty|`$dirty`组件脏状态更新检查函数。|
 * |yuLoading|`$loading`父组件驱动子组件更新检查函数。|
 * |yuQuery|`$query`查询条件更新检查函数。|
 * |yuRouter|`$router`中的路由参数更新检查函数。|
 *
 * ## 2. 通道核心点
 *
 * @module _channel
 */
export default {
    ...Yo,
    /*
     * -- 模板方法
     * ylCard - <PageCard/> （内含 yoRender）
     */
    ...Tpl,
    /*
     * 特殊界面
     * tabular / category
     */
    ...Yi,
    // -- 更新专用方法
    /*
    * 检查 props 中的 $query 变化
    * 检查 state 中的 query 变化
    */
    ...Yu,
}