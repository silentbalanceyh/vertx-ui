import __Zn from '../zero.module.dependency';
import Ux from "ux";

export default (reference, data, config = {}) => {
    const dialog = __Zn.toDialog(config);
    dialog.onOk = () => __Zn.Op.$opLogout(reference);
    const md = Ux.v4Modal()
    md.confirm(dialog);
}