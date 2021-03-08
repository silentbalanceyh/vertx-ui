import Ux from 'ux';
import {Dsl} from 'entity';

const rxWinOpen = (reference) => (config = {}, data = {}) => () => {
    // 打开窗口
    const state = {};
    const {$window = {}} = reference.state;
    const $dialog = $window[config.key];
    state.$visible = true;
    state.$inited = data;
    if ($dialog) state.$dialog = $dialog;
    reference.setState(state);
}
const rxExecutor = (reference) => (item = {}, data = {}) => () => {
    // 提取 executor 函数名称，item -> config 中配置 executor
    const {config = {}} = item;
    const key = config.executor;
    const {$executor = {}} = reference.props;
    if ($executor.hasOwnProperty(key)) {
        const fnExecutor = $executor[key];
        if (Ux.isFunction(fnExecutor)) {
            /*
             * 配置和数据交换，函数签名的最终规范执行：
             * 1. 首参：data
             * 2. 二参：config
             * 3. 三参：callback
             */
            fnExecutor(data, config, {
                // 更新专用函数（更新当前界面）
                rxRefresh: () => {
                    const stateRef = reference.state;
                    const {$query = {}} = reference.state;
                    rxRefresh(reference, stateRef, $query);
                },
            });
        }
    } else {
        console.error(`对不起，未注入 executor 到 $executor 变量中，key = ${key}`);
    }
}
const rxRefresh = (reference, stateRef = {}, query = {}) => {
    const {rxSearch} = reference.props;
    if (Ux.isFunction(rxSearch)) {
        Dsl.of(reference).bind(rxSearch).ok(response => {
            stateRef.$data = response;
            stateRef.$ready = true;
            reference.setState(stateRef);
        }).async(query);
    } else {
        console.error("对不起，API核心方法 rxSearch 不存在！");
    }
}
/*
 * 按钮解析专用函数
 */
const yiAction = (reference, button = {}) => {
    const normalized = {};
    const {text, config = {}, ...rest} = button;
    normalized.key = Ux.encryptBase64(text);
    normalized.text = text;
    if (config.confirm) {
        normalized.confirm = config.confirm;
    }
    if (config.window) {
        // 窗口类型
        normalized.onClick = rxWinOpen(reference);
    } else if (config.executor) {
        // 执行类型
        normalized.onClick = rxExecutor(reference);
    }
    normalized.config = config;
    Object.assign(normalized, rest);
    return normalized;
}

const yiSearch = (reference, stateRef = {}) => (query = {}) =>
    rxRefresh(reference, stateRef, query);

const yiWindow = (reference, configData = {}) => {
    const {connect = []} = configData;
    const $window = {};
    connect.forEach(item => {
        const {config = {}} = item;
        if (config.window) {
            const windowConfig = Ux.configDialog(reference, config.window);

            const key = Ux.encryptBase64(item.text);
            $window[key] = windowConfig;
        }
    });
    return $window;
}
export default {
    yiSearch,
    yiAction,
    yiWindow,
}