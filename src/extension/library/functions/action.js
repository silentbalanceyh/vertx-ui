import U from "underscore";
import Ux from "ux";
import O from '../op';

const _parseClick = (action, reference) => {
    const dataKey = action.onClick;
    if (!U.isFunction(dataKey)) {
        /*
         * 从 reference 中提取
         */
        const {$actions = {}} = reference.props;
        const actions = Ux.clone(O.DEFAULT_ACTION);
        Object.assign(actions, $actions);
        /*
         * ACTIONS 处理
         */
        const generator = actions[dataKey];
        if (U.isFunction(generator)) {
            const onClick = generator(reference);
            if (U.isFunction(onClick)) {
                action.onClick = onClick;
            }
        }
        /*
         * 未注入成功
         */
        if (!U.isFunction(action.onClick)) {
            action.onClick = () => {
                console.error("检查配置项：", action, dataKey);
            }
        }
    }
    return action;
};

const _parseAction = (action, reference) => {
    if (action) {
        let button = {};
        if ("string" === typeof action) {
            const actions = {};
            const parsed = action.split(',');
            actions.key = parsed[0];
            actions.id = parsed[0];
            actions.text = parsed[1];
            actions.onClick = parsed[2];
            actions.type = parsed[3] ? parsed[3] : "default";
            if (parsed[4]) {
                actions.icon = parsed[4];
            }
            button = _parseClick(actions, reference);
        } else if (U.isObject(action)) {
            button = Ux.clone(action);
        }
        /*
         * 防重复提交加载表单效果处理
         */
        const {$loading = false} = reference.state;
        button.loading = $loading;
        return button;
    }
};
const _parseAuthorized = (action = {}, reference) => {
    if (action) {
        const {$action = {}} = reference.state;
        /*
         * 权限判断
         */
        if ($action.hasOwnProperty(action.key)) {
            if ($action[action.key]) {
                return action;
            }
        } else {
            return action;
        }
    }
};
const toButtons = (extension = [], reference) => {
    return extension
        .map(each => _parseAction(each, reference))
        .map(each => _parseAuthorized(each, reference))
        .filter(item => !!item);
};

export default {
    toButtons,
}