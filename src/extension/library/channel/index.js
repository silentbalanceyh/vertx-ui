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