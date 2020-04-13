// -------------- 列表专用 --------------------
// -------------- 模板函数 --------------------
import Tpl from './tpl';
import Yi from './yi';
import Yu from './yu';
import Yo from './yo';

/**
 * 内部模块
 *
 * `y`系列通道专用方法，Zero Extension中最大的亮点。
 *
 * * yi：状态专用处理，`yi - 嗨，i - initialize`
 * * yo：render专用处理，`yo - 哟，o - origin`
 * * yu：更新专用处理, `yu - 唷，u - update`
 * * yl：组件专用处理（渲染方法），`yl - 界面，l - loading`
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