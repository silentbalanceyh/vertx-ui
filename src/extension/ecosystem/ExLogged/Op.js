import U from 'underscore';
import {Modal} from 'antd';
import Ex from 'ex';

const fnLogout = (reference) => {
    const {config: {window: {logout}}} = reference.props;
    const $config = Ex.toDialog(logout);
    $config.onOk = () => Ex.Op.$opLogout(reference);
    Modal.confirm($config);
};
const _DISPATCH = {
    fnLogout
};
const onSelect = (reference) => (event) => {
    const {data: {metadata = {}}} = event.item.props;
    const executor = _DISPATCH[metadata.function];
    if (U.isFunction(executor)) {
        executor(reference);
    }
};
export default {
    onSelect,
}