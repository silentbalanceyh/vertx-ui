import Ex from "ex";
import Ux from "ux";


const fnLogout = (reference) => {
    const {config: {window: {logout}}} = reference.props;
    const $config = Ex.toDialog(logout);
    $config.onOk = () => Ex.Op.$opLogout(reference);
    const md = Ux.v4Modal()
    md.confirm($config);
};
const _DISPATCH = {
    fnLogout
};
const rxSelect = (reference) => (event) => {
    const {data: {metadata = {}}} = event.item.props;
    const executor = _DISPATCH[metadata.function];
    if (Ux.isFunction(executor)) {
        executor(reference);
    }
};
export default {
    rxSelect,
}