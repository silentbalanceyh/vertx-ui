import __Zn from './zero.module.dependency';
// ----------------------------- 常用事件处理方法 ------------------------------
/*
 * 工作流部分最后会使用此处相关操作
 * 单纯打开/关闭窗口
 * - 添加按钮
 * - 编辑按钮
 * 该操作会设置核心变量，变量如下
 * -- $inited: 表单初始化方法
 * -- $visible：窗口显示或隐藏
 * -- $loading：窗口是否正在加载
 * -- $submitting：窗口处于正在提交
 */

// ----------------------------- rxShow
const rxShow = (reference, addOn = {}) => {
    const {$inited, state = {}} = addOn;
    const updated = __Zn.clone(state);
    // updated.$visible = true;
    // updated.$submitting = false;
    // updated.$loading = false;
    // updated.$inited = $inited;
    // reference.?etState(updated);
    __Zn.of(reference).in({
        ...updated,
        $inited
    }).open().load().done();
}
const rxShowFn = (reference, addOn = {}) => (event) => {
    __Zn.prevent(event);
    rxShow(reference, addOn);
}
const rxOpen = (reference, addOn = {}, rxRunner) => {
    const {
        state = {},
        $inited = {}
    } = addOn;
    __Zn.asyncWrap(reference, {}, () => rxRunner($inited)).then($queried => {
        const stateShow = {};
        stateShow.state = state;
        stateShow.$inited = $queried;
        rxShow(reference, stateShow);
    });
}
const rxOpenFn = (reference, addOn = {}, rxRunner) => (event) => {
    __Zn.prevent(event);
    rxOpen(reference, addOn, rxRunner);
}
// ----------------------------- rxClose
const rxClose = (reference, addOn = {}) => {
    const {
        state = {},
        pRefresh = false,   // 是否刷新界面
    } = addOn;
    const updated = __Zn.clone(state);
    // updated.$visible = false;
    // updated.$submitting = false;
    // updated.$loading = false;
    // updated.$inited = undefined;
    // reference.?etState(updated);
    if (pRefresh) {
        updated.$refresh = __Zn.randomString(12);
    }
    __Zn.of(reference).in({
        ...updated,
        $inited: undefined
    }).hide().load().done();
}
const rxCloseFn = (reference, addOn = {}) => (event) => {
    __Zn.prevent(event);
    rxClose(reference, addOn);
}

// ----------------------------- rxRow
const rxExecute = (reference, addOn, rxRunner) => {
    const {
        $inited,
        state = {},
        // 响应专用信息
        ...parameters
    } = addOn;
    const {
        pRefresh = true,
        pMessageKey = "success",
        pMessage = {},
        ...rest
    } = parameters;
    __Zn.dgDebug(parameters, "行执行 Executor 构造参数！", "#8B1C62");
    let promise;
    if (__Zn.isFunction(rxRunner)) {
        promise = __Zn.asyncWrap(reference, {
            failure: pMessage.error,
            success: pMessage[pMessageKey],
        }, () => rxRunner($inited, rest));
    } else {
        promise = __Zn.promise($inited);
    }
    return promise.then(() => {
        // 响应信息处理
        const updated = __Zn.clone(state);
        if (pRefresh) {
            updated.$refresh = __Zn.randomString(12);
        }
        if (!__Zn.isEmpty(updated)) {
            __Zn.of(reference).in(updated).done();
            // reference.?etState(updated);
        }
    })
}
const rxRow = (reference, addOn = {}, rxRunner) =>
    rxExecute(reference, addOn, rxRunner)
const rxRowFn = (reference, addOn = {}, rxRunner) => (event) => {
    __Zn.prevent(event);
    rxRow(reference, addOn, rxRunner);
}
// ----------------------------- rxSelected
const rxSelected = (reference, addOn = {}, rxRunner) => {
    const {
        state = {},
    } = addOn;
    const updated = __Zn.clone(state);
    __Zn.asyncWrap(reference, {}, rxRunner).then($selected => {
        updated.$selected = $selected;
        __Zn.of(reference).in(updated).done();
        // reference.?etState(updated);
    });
}
const rxSelectedFn = (reference, addOn = {}) => ($selected = []) => {
    rxSelected(reference, addOn, () => __Zn.promise($selected));
}

// ----------------------------- rxBatch
const rxBatch = (reference, addOn = {}, rxRunner) =>
    rxExecute(reference, addOn, rxRunner)
const rxBatchFn = (reference, addOn = {}, rxRunner) => (params = {}) => {
    const parameters = {
        ...addOn,
        ...params
    }
    __Zn.dgDebug(parameters, "批量 Executor 构造参数！", "#8B1C62");
    rxBatch(reference, parameters, rxRunner)
}
export default {
    // 快速开发核心方法（函数Action专用）
    /*
     * 统一数据结构
     * {
     *     $inited: {},     // 记录数据信息
     *     state: {},       // 附加状态信息
     *     ...rest: {},     // 构造成 config 状态信息
     * }
     */
    // 显示窗口
    rxShow,
    rxShowFn,
    // 关闭窗口
    rxClose,
    rxCloseFn,
    // 行执行操作
    rxRow,
    rxRowFn,
    // 行选择操作
    rxSelected,
    rxSelectedFn,
    // 行打开操作
    rxOpen,
    rxOpenFn,
    // 批量操作
    rxBatch,
    rxBatchFn,
}