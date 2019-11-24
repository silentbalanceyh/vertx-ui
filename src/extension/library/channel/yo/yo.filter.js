import yoAmbient from './yo.ambient';
import Fn from '../../functions';
import Ux from 'ux';

export default (reference) => {
    const attrs = yoAmbient(reference);
    /*
     * 初始化数据
     */
    const {$inited = {}} = reference.props;
    if (Ux.isEmpty($inited)) {
        attrs.$inited = {
            connector: "OR"
        };
    } else {
        const data = Ux.clone($inited);
        const connector = data[""] ? "AND" : "OR";
        delete data[""];
        data.connector = connector;
        attrs.$inited = data;
    }
    /*
     * 关闭专用函数
     */
    attrs.rxClose = Fn.rsVisible(reference, false);
    return attrs;
}