import renderJsx from './P.web.list.jsx';
import Yo from '../yo';

export default (reference, item = {}) => {
    const {
        css = {}
    } = reference.props;
    /*
     * 处理 op 相关信息
     */
    const opens = Yo.yoOpen(reference);
    const extra = Yo.yoExtra(reference);
    /*
     * 处理 batch 批量
     */
    const batch = Yo.yoBatch(reference);
    /*
     * 局部变量
     */
    const search = Yo.yoSearch(reference);
    /*
     * 处理 table 相关信息
     */
    const table = Yo.yoTable(reference);
    return renderJsx(reference, {
        css,
        opens,
        batch,
        table,
        search,
        extra,
    });
}