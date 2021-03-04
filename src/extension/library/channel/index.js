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