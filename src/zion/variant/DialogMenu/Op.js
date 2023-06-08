import __Zn from '../zero.uca.dependency';

const _runFn = (reference, item) => {
    const {executor} = item;
    const {$executor = {}} = reference.props;
    const fnExecute = $executor[executor];
    if (__Zn.isFunction(fnExecute)) {
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
        __Zn.of(reference).in(state).done();
        // reference.?etState(state);
    } else {
        // 函数执行
        const {button = {}} = item;
        if (button.confirm) {
            // 弹出窗口专用
            const md = __Zn.v4Modal()
            md.confirm({
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
    __Zn.prevent(event);
    _runExecute(reference, item);
};
const rxMenu = (reference) => (item = {}) => {
    const {$configMap = {}} = reference.state;
    const data = $configMap[item.key];
    if (data) {
        _runExecute(reference, data);
    } else {
        console.warn("对不起，配置有错，请检查！")
    }
}
export default {
    rxClick,
    rxMenu
}