import U from 'underscore';
import Ux from 'ux';
import {Modal} from 'antd';
import Ex from 'ex';

const fnLogout = (reference) => {
    const {config = {}} = reference.props;
    const {window = {}} = config;
    const dialog = window['logout'];
    let $config = {};
    if (U.isObject(dialog)) {
        $config = Ux.clone(dialog);
    } else if ("string" === typeof dialog) {
        $config = {content: $config}
    }
    Modal.confirm({
        ...$config,
        onOk: () => {
            // 清掉Session
            Ux.toLogout();
            // 路由处理
            Ux.toRoute(reference, Ux.Env.ENTRY_LOGIN);
            // 清楚State上的数据
            Ux.eraseTree(reference, ["user"]);
        }
    })
};
const _DISPATCH = {
    fnLogout
};
const _2fnSelect = (reference) => (event) => {
    const {data} = event.item.props;
    if (data && U.isObject(data)) {
        const {metadata = {}} = data;
        const executor = _DISPATCH[metadata.function];
        if (U.isFunction(executor)) {
            executor(reference);
        }
    }
};
const _1normalizeMenu = (reference = {}) => {
    const {data = [], $app} = reference.props;
    const result = Ux.clone(data)
        .filter(item => "TOP-MENU" === item.type)
        .sort((left, right) => left.order - right.order);
    result.forEach(item => {
        Ex.F.toMeta(item);
        /* 如果 uri 无值，则不设置 */
        if ($app && U.isFunction($app.is) && item.uri) {
            item.uri = `/${$app._('path')}${item.uri}`
        }
    });
    return result;
};
export default {
    _2fnSelect,
    _1normalizeMenu,
}