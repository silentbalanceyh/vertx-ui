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
const _2fnSelect = (reference) => (event) => {
    const {data: {metadata = {}}} = event.item.props;
    const executor = _DISPATCH[metadata.function];
    if (U.isFunction(executor)) {
        executor(reference);
    }
};
const _1normalizeMenu = (reference = {}) => {
    const {data = [], $app} = reference.props;
    return data
        .map(item => Ex.mapMeta(item))
        .map(item => Ex.mapUri(item, $app))
};
export default {
    _2fnSelect,
    _1normalizeMenu,
}