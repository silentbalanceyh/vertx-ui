import U from 'underscore';
import Ux from 'ux';
import {Modal} from 'antd';

const fnLogout = (reference, key = "") => {
    const {config = {}} = reference.props;
    const {window = {}} = config;
    const dialog = window[key];
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
    "key.menu.logout": fnLogout
};
const _2fnSelect = (reference) => (event) => {
    const executor = _DISPATCH[event.key];
    if (U.isFunction(executor)) {
        executor(reference, event.key);
    } else {
        console.error("配置键没有对应的函数：", event.key);
    }
};
export default {
    _2fnSelect
}