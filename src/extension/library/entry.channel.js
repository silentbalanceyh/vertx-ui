import Tpl from './channel.interface.yl';
import Yi from './channel.interface.yi';
import Yu from './channel.interface.yu';
import Yo from './channel.interface.yo';
import Xui from './channel.interface.xui';

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

    ...Xui,
}