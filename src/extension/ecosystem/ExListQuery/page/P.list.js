import renderJsx from './P.web.list.jsx';
import Ex from "ex";

export default (reference, item = {}) => {
    const {
        css = {}
    } = reference.props;
    /*
     * 处理 op 相关信息
     */
    const opens = Ex.yoListOpen(reference);
    const extra = Ex.yoListExtra(reference);
    /*
     * 处理 table 相关信息
     */
    const table = Ex.yoTable(reference);
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