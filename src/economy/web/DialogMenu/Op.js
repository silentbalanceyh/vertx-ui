import Ux from 'ux';
import {Modal} from "antd";

const _runFn = (reference, item) => {
    const {executor} = item;
    const {$executor = {}} = reference.props;
    const fnExecute = $executor[executor];
    if (Ux.isFunction(fnExecute)) {
        fnExecute(item, reference);
    } else {
        console.error(`函数${executor}不存在于$executor中。`, $executor);
    }
}

const _runExecute = (reference, item) => {
    // 函数执行和窗口执行
    if (item.component) {
        const state = {};
        state.$visible = item.key;
        reference.setState(state);
    } else {
        // 函数执行
        const {button = {}} = item;
        if (button.confirm) {
            // 弹出窗口专用
            Modal.confirm({
                content: button.confirm,
                onOk: () => _runFn(reference, item)
            })
        } else {
            // 直接执行
            _runFn(reference, item);
        }
    }
}
const rxClick = (reference, item) => (event) => {
    Ux.prevent(event);
    _runExecute(reference, item);
};
const rxMenu = (reference) => (menuitem) => {
    const {data = {}} = menuitem.item.props;
    _runExecute(reference, data);
}
export default {
    rxClick,
    rxMenu
}