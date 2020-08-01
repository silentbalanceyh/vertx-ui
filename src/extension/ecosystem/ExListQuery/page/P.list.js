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
     * 处理 table 相关信息
     */
    const table = Yo.yoTable(reference);
    /*
     * 处理 plugins
     */
    return renderJsx(reference, {
        css,
        opens,
        table,
        extra,
    });
}