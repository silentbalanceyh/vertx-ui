import Ux from 'ux';

const rxSpinOff = (reference) => (event) => {
    Ux.prevent(event);
    reference.setState({
        $forbidden: false,     // 可执行主屏幕操作
        $popover: undefined,   // 将所有的 popover 全部关闭
    });
}
const onRaft = (reference, consumer) => {
    /*
     * 布局表单更新数据信息
     */
    const {raft} = reference.state;
    if (raft) {
        /*
         * 直接变更 form 节点的数据（修改原始数据）
         */
        let $raft = Ux.clone(raft);
        if ($raft.form) {
            $raft = consumer($raft);
        } else {
            console.error("没找到 form 配置！！", $raft)
        }
        /* 更新 */
        return Ux.promise($raft);
    } else {
        console.error("引用搜索失败！！", reference)
    }
}
const onLayout = (raft = {}, params = {}) => {
    const {form} = raft;
    form.columns = Ux.valueInt(params.columns, 4);
    form.window = Ux.valueInt(params.window, 1);
    const {className = ""} = form;
    const inputCls = params.className ? params.className : "";
    if ("APPEND" === params['cssMode']) {
        form.className = `${className} ${inputCls}`;
    } else {
        form.className = inputCls;
    }
    return raft;
}
const onHidden = (raft = {}, params = {}) => {
    if (params.hidden) {
        raft.form.hidden = Ux.clone(params.hidden);
    } else {
        raft.form.hidden = [];
    }
    return raft;
}
const onAssist = (raft = {}, params) => {
    if (params) {
        const {form} = raft;
        if (!form.assist) {
            form.assist = {};
        }
        if ("string" === typeof params) {
            if (form.assist.hasOwnProperty(params)) {
                delete form.assist[params];
            }
        } else {
            const {name, ...rest} = params;
            if (rest) {
                form.assist[name] = rest;
            }
        }
    }
    return raft;
}
const onInit = (raft = {}, params) => {
    if (Ux.isArray(params)) {
        const {form} = raft;
        const magic = {};
        params.forEach(item => magic[item.name] = item.value);
        form.initial = magic;
    }
    return raft;
}
const onCallback = (reference) => ($raft) => {
    reference.setState({
        raft: $raft,
        $forbidden: false,     // 可执行主屏幕操作
        $popover: undefined,   // 将所有的 popover 全部关闭
    });
}
const onUi = (raft = {}, params) => {
    if (Ux.isArray(params)) {
        const {form} = raft;
        /* 更新基本字段 */
        if (form.ui) {
            form.ui = params
                .map(item => item.data)
                .filter(Ux.isArray);
        }
        const {actions} = form;
        /* 针对 actions 执行特殊处理 */
        if (actions) {
            params.map(item => item.data)
                .flatMap(item => Ux.isArray(item) ? item : [])
                .filter(item => "aiAction" === item.render)
                .map(item => Ux.valuePath(item, "raft.optionJsx.extension"))
                .flatMap(item => Ux.isArray(item) ? item : [])
                .filter(item => item.hasOwnProperty('server'))
                .filter(item => !!item)
                .forEach(item => {
                    let original = actions[item.key];
                    if (original) {
                        original = Ux.clone(original);
                        const updated = item.server;
                        if (updated) {
                            Object.assign(original, updated);
                            actions[item.key] = original;
                        }
                    }
                });
        }
    }
    return raft;
}
export default {
    rxSpinOff,
    raft: (reference) => ({
        onLayout: (params) => onRaft(reference, (raft) => onLayout(raft, params))
            .then(onCallback(reference)),
        onHidden: (params) => onRaft(reference, (raft) => onHidden(raft, params))
            .then(onCallback(reference)),
        onAssist: (params) => onRaft(reference, (raft) => onAssist(raft, params))
            .then(raft => reference.setState({raft})),
        onInit: (params) => onRaft(reference, (raft) => onInit(raft, params))
            .then(raft => reference.setState({raft})),
        onUi: (params) => onRaft(reference, (raft) => onUi(raft, params))
            .then(raft => reference.setState({raft}))
    })
}