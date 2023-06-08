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
        let $response = Ux.clone(response);
        {
            const first = $response.filter(item => "DEFAULT" === item.name);
            const left = $response.filter(item => "DEFAULT" !== item.name)
                .sort(Ux.sorterDescDFn("updatedAt"));
            $response = first.concat(left);
            state.$data = $response;
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
const rxOpen = (reference, $inited = {}, $mode = Ux.Env.FORM_MODE.EDIT) => (event) => {
    Ux.prevent(event);
    $inited = Ux.clone($inited);
    const {$myDefault = {}} = reference.props;
    if ($myDefault.name === $inited.name) {
        if (!$inited.title) {
            $inited.title = $myDefault.title;
        }
    }
    // 列计算专用
    const {
        config = {}
    } = reference.props;
    const {$columns = []} = config;
    if (!$inited.projection) {
        $inited.projection = $columns.map(column => column.dataIndex);
    }
    Ux.of(reference).in({
        $inited,
        $mode,
    }).open().done();
    // reference.?etState({
    //     $visible: true,
    //     $inited,
    // })
}
const rxDelete = (reference, item, config = {}) => (event) => {
    Ux.prevent(event);
    /* 视图防重复提交 */
    return Ux.of(reference).spinning().next().then(() => Ux.ajaxDelete("/api/view-p/:key", item).then(() => {
        // 显示删除信息
        Ux.messageSuccess(config.success);
        // 重新加载
        Ux.of(reference).in({
            // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VR5J
            $loading: true
        }).done();
        // reference.?etState({$dirty: true});
    }))
}
const rxDeleteBatch = (reference, config = {}) => (event) => {
    Ux.prevent(event);
    return Ux.of(reference).spinning().next().then(() => {
        const {$selectedKeys = []} = reference.state;
        return Ux.ajaxDelete("/api/batch/view-p/delete", $selectedKeys).then(() => {
            // 显示删除信息
            Ux.messageSuccess(config.success);
            // 重新加载
            Ux.of(reference).in({
                // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VR5J
                $loading: true
            }).done();
            // reference.?etState({$dirty: true});
        })
    })
}
const rxChecked = (reference, item) => (event) => {
    let {$selectedKeys = []} = reference.state;
    const checked = event.target.checked;
    if (checked) {
        $selectedKeys = Ux.clone($selectedKeys);
        $selectedKeys.push(item.key);
        Ux.of(reference).in({$selectedKeys}).done();
        // reference.?etState({$selectedKeys});
    } else {
        const set = new Set($selectedKeys);
        set.delete(item.key);
        Ux.of(reference).in({$selectedKeys: Array.from(set)}).done();
        // reference.?etState({$selectedKeys: Array.from(set)})
    }
}
const rxRadio = (reference, item) => () => {
    Ux.of(reference).in({$selectedKey: item.name}).done();
    // reference.?etState({$selectedKey: item.name});
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
        Ux.of(reference).in({
            $mode: "VIEW",
        }).done();
        // reference.?etState({$mode: "VIEW"});
    } else {
        Ux.of(reference).in({
            $mode: "EDIT",
            $selectedKeys: []
        }).done();
        // reference.?etState({$mode: "EDIT"});
    }
}
const rxYes = (reference) => (event) => {
    Ux.prevent(event);
    const {rxMyViewAt} = reference.props;
    if (Ux.isFunction(rxMyViewAt)) {
        const {$selectedKey, $data = []} = reference.state;
        const item = Ux.elementUnique($data, "name", $selectedKey);
        if (item) {
            Ux.of(reference)._.close({}, {$stop: true});
            rxMyViewAt(item);
        } else {
            Ux.messageFailure("数据出错！", 3);
        }
    } else {
        Ux.messageFailure("无法捕捉函数 rxMyViewAt，视图功能未完全打开！", 3);
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