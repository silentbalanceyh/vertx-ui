// -------------- 列表专用 --------------------
// -------------- 模板函数 --------------------
import Tpl from './tpl';
import Yi from './yi';
import Yu from './yu';
import Yo from './yo';

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