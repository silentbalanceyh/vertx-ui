import Ux from 'ux';
import Rdr from './UI.Render';
import Event from './Op.Event';
import * as U from 'underscore';

const parseButton = (reference) => {
    const {$button = {}} = reference.props;
    const config = Ux.aiExprAction($button);
    config.onClick = Event.rtClick(reference);
    return config;
};
const parseDialog = (reference, item: any = {}) => {
    let config = Ux.aiExprWindow(item.dialog);
    config = Ux.clone(config);
    config.onCancel = (event) => {
        event.preventDefault();
        let state = Ux.clone(reference.state);
        state.visible[item.key] = false;
        console.info(reference);
        reference.setState(state);
    };
    const id = config.onOk;
    if (!U.isFunction(id)) {
        config.onOk = () => Ux.connectId(id);
    }
    return config;
};
const parseDrawer = (reference, item) => {
    let config = Ux.aiExprDrawer(item);
    return config;
};
const configuration = {
    // 菜单由于Popover的冲突，不提供Popover的模式
    DIALOG: parseDialog,
    DRAWER: parseDrawer
};
const initState = (reference) => {
    // 1.判断当前组件是哪种Button，使用了哪种Dialog
    const {$mode, $items = []} = reference.props;
    let itemsConfig = Ux.clone($items);
    // 2.按钮处理
    const button = parseButton(reference);
    // 3.Window的解析函数不一致
    if (0 < $items.length && ("DIALOG" === $mode || "DRAWER" === $mode)) {
        const items = [];
        const renders = {};
        const visible = {};
        itemsConfig.forEach(item => {
            // 解析对应的菜单项
            item.button = Ux.aiExprAction(item.button);
            // item中button的key赋值
            item.key = item.button.key;
            if (item.hasOwnProperty("dialog")) {
                // 使用executor解析窗口
                const executor = configuration[$mode];
                const render = Rdr[$mode];
                item.dialog = executor(reference, item);
                item.type = "DIALOG";
                renders[item.key] = render(reference, item);
                visible[item.key] = false;
            } else if (item.hasOwnProperty("confirm")) {
                // 删除专用模式
                item.type = "CONFIRM";
                if ("string" === typeof item.confirm) {
                    const formatted = item.confirm.split(",");
                    const confirm: any = {};
                    confirm.content = formatted[0];
                    if (formatted[1]) confirm.okText = formatted[1];
                    if (formatted[2]) confirm.cancelText = formatted[2];
                    item.confirm = confirm;
                }
                renders[item.key] = Rdr.renderConfirm(reference, item);
            } else {
                item.type = "DIRECT";
            }
            items.push(item);
        });
        return {
            button, items,
            // 渲染
            renders,
            // 呈现，DIALOG专用
            visible
        }
    } else {
        // Error
        if (0 === $items.length) {
            return {error: Ux.E.fxMessageError(10094, $items.length)};
        }
        return {error: Ux.E.fxMessageError(10093, $mode)};
    }
};
export default {
    initState
}