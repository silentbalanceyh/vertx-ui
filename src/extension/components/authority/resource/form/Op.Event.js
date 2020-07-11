import Ux from "ux";
import Ex from 'ex';

const toDataItem = (permission, action) => {
    const dataItem = {};
    dataItem.permName = permission.name;
    dataItem.permKey = permission.key;  // 必须
    /*
     * permission 中的 actions 数组
     * 该数组和 _children 同构
     */
    const {actions = []} = permission;
    dataItem._actions = Ux.clone(actions);
    /*
     * 当前 permission 引用
     */
    dataItem.data = Ux.clone(permission);

    // action 专用主键值
    if (action) {
        dataItem.key = action.key;
        dataItem.permOp = action.key;
        dataItem.uri = action.uri;
        dataItem.method = action.method;
    } else {
        const key = Ux.randomUUID();
        dataItem.key = key;
        dataItem.permOp = key;
        /*
         * 这种情况需要处理
         */
        if (0 === dataItem._actions.length) {
            dataItem._actions.push({key});     // 必须包含基础信息
        }
    }
    return dataItem;
}

const toData = (permissions = []) => {
    const $data = [];
    permissions.forEach((permission = {}) => {
        const {actions = []} = permission;
        if (0 < actions.length) {
            actions.forEach((action) => $data.push(toDataItem(permission, action)));
        } else {
            $data.push(toDataItem(permission))
        }
    });
    return $data;
}
const rxAdd = (reference, record) => (event) => {
    // 打开窗口
    Ex.uiDialog(reference, __dialog => __dialog.onOpen(record))
}
const rxDelete = (reference, record) => (event) => {
    const {key, permKey} = record;
    if (key && permKey) {
        Ux.fn(reference).rxDelete(permKey, key);
    }
}
const rxSearch = (reference) => (event) => {
    /*
     * 当前被移除的
     */
    const {$removed = []} = reference.props;
    const criteria = {};
    /*
     * 新资源，没有关联任何权限
     */
    
    criteria['permissionId,n'] = "";
    criteria['key,i'] = $removed;

    return Ux.ajaxPost("/api/action/search", {criteria}).then(response => {
        const {list = []} = response;
        reference.setState({$data: list, $selected: undefined});
    })
}
const rxSelect = (reference) => (selectedKeys = []) => {
    const {$data = []} = reference.state;
    const key = selectedKeys[0];
    if (key) {
        const $selected = Ux.elementUnique($data, 'key', key);
        reference.setState({$selected});
    }
}
const rxConfirm = (reference) => (event) => {
    Ux.prevent(event);
    const {$selected} = reference.state;
    if ($selected) {
        const {$inited = {}} = reference.props;
        const permId = $inited['permKey'];
        if (permId) {
            Ux.fn(reference).rxAdd(permId, $selected);
        }
    } else {
        Ux.sexMessage(reference, "selection");
    }
}
export default {
    toData,
    rxConfirm,
    rxDelete,
    rxAdd,
    rxSearch,
    rxSelect,
}