import yoAmbient from './yo.ambient';
import Fn from '../functions';
import Ux from 'ux';

export default (reference = {}, {form}) => {
    const attrs = yoAmbient(reference);
    /*
     * 配置 config 相关信息构成多态，直接从 grid 中读
     */
    const config = Ux.fromHoc(reference, "grid");
    if (config) {
        attrs.config = config;
    }
    /*
     * 专用组件信息
     * 用于配置 $form 专用组件
     */
    if (form) {
        attrs.$form = form;
    }
    /*
     * $query 中的 this.state
     */
    const {$query = {}} = reference.state ? reference.state : {};
    attrs.$query = $query;
    /*
     * options = {}
     */
    const {options = {}} = config;
    if (options[Fn.Opt.IDENTIFIER]) {
        attrs.$identifier = options[Fn.Opt.IDENTIFIER];
    }
    return attrs;
}