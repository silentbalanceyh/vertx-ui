/*
 * 重新加载数据专用
 */
import Ex from "ex";
import Ux from "ux";

const rxRefresh = (reference, state = {}) => {
    const {$options = {}} = reference.props;
    const params = {};
    params.method = "POST";
    params.uri = $options[Ex.Opt.AJAX_SEARCH_URI];
    const position = $options[Ex.Opt.AJAX_POSITION];
    if (position) {
        params.position = Ux.parsePosition(position, reference);
    }
    return Ux.ajaxPost("/api/view-p/fetch", params).then(response => {
        /*
         * 基础数据
         */
        if (Ux.isArray(response)) {
            state.$data = response;
        } else {
            state.$data = [];
        }
        state.$loading = false;     // 加载完成
        state.$dirty = false;       // 直接同步完成
        // 刷新时清空
        state.$selectedKeys = [];
        const {$myView} = reference.props;
        state.$selectedKey = $myView ? $myView.name : undefined;
        return Ux.promise(state);
    })
}
const rxOpen = (reference, $inited = {}) => (event) => {
    Ux.prevent(event);
    $inited = Ux.clone($inited);
    const {$myDefault = {}} = reference.props;
    if ($myDefault.name === $inited.name) {
        if (!$inited.title) {
            $inited.title = $myDefault.title;
        }
    }
    reference.setState({
        $visible: true,
        $inited,
    })
}
const rxDelete = (reference, item, config = {}) => (event) => {
    Ux.prevent(event);
    return Ux.ajaxDelete("/api/view-p/:key", item).then(() => {
        // 显示删除信息
        Ux.messageSuccess(config.success);
        // 重新加载
        reference.setState({$dirty: true});
    })
}
const rxDeleteBatch = (reference, config = {}) => (event) => {
    Ux.prevent(event);
    const {$selectedKeys = []} = reference.state;
    return Ux.ajaxDelete("/api/batch/view-p/delete", $selectedKeys).then(() => {
        // 显示删除信息
        Ux.messageSuccess(config.success);
        // 重新加载
        reference.setState({$dirty: true});
    })
}
const rxChecked = (reference, item) => (event) => {
    let {$selectedKeys = []} = reference.state;
    const checked = event.target.checked;
    if (checked) {
        $selectedKeys = Ux.clone($selectedKeys);
        $selectedKeys.push(item.key);
        reference.setState({$selectedKeys});
    } else {
        const set = new Set($selectedKeys);
        set.delete(item.key);
        reference.setState({$selectedKeys: Array.from(set)})
    }
}
const rxRadio = (reference, item) => () => {
    reference.setState({$selectedKey: item.name});
}
const isView = (reference) => {
    const {$mode = "VIEW"} = reference.state;
    return "VIEW" === $mode;
}
const isEdit = (reference) => {
    const {$mode = "VIEW"} = reference.state;
    return "VIEW" !== $mode;
}
const rxSwitch = (reference) => (checked) => {
    if (checked) {
        reference.setState({$mode: "VIEW"});
    } else {
        reference.setState({$mode: "EDIT"});
    }
}
const rxYes = (reference) => (event) => {
    Ux.prevent(event);
    const {rxViewMy} = reference.props;
    if (Ux.isFunction(rxViewMy)) {
        const {$selectedKey, $data = []} = reference.state;
        const item = Ux.elementUnique($data, "name", $selectedKey);
        if (item) {
            const viewData = {};
            viewData.name = item.name;
            viewData.title = item.title;
            rxViewMy(viewData);
            Ex.rx(reference).close();
        } else {
            Ux.messageFailure("数据出错！", 3);
        }
    } else {
        Ux.messageFailure("无法捕捉函数 rxViewMy，视图功能未完全打开！", 3);
    }
}
export default {
    rxSwitch,
    isView,
    isEdit,
    // 事件
    rxRefresh,
    rxOpen,
    rxDelete,
    rxDeleteBatch,
    // 多选（删除所选专用）
    rxChecked,
    rxRadio,
    rxYes,
}