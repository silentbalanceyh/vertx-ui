import Ux from 'ux';
import Ex from 'ex';

const $opSelect = (reference) => (data = {}) => {
    if (Ux.isEmpty(data)) {
        reference.setState({
            $role: undefined,
            $keySet: undefined,       // Checked 专用
            $selectedKeys: [],
            $selectedData: []
        });
    } else {
        const $role = Ux.clone(data);
        /*
         * 选择 $role，构造 $role 的权限集
         * 并且根据权限构造 code = key 的倒排表
         */
        const state = {};
        return Ux.ajaxGet("/api/permission/role/:roleId", $role).then(relations => {
            const $keySet = new Set();
            if (Ux.isArray(relations)) {
                relations.map(item => item['permId'])
                    .filter(permId => !!permId)
                    .forEach(permId => $keySet.add(permId))
            }
            state.$keySet = $keySet;
            state.$role = $role;
            reference.setState(state);
        })
    }
}
const $opSave = (reference) => (event) => {
    Ux.prevent(event);
    const {$keySet, $role} = reference.state;
    if ($keySet && $role) {
        const permissions = Array.from($keySet);
        const roleId = $role['roleId'];
        reference.setState({$submitting: true});
        Ux.ajaxPut("/api/permission/role/:roleId", {
            roleId,
            $body: permissions
        }).then(() => Ux.sexDialog(reference, "updated", () => {
            reference.setState({$submitting: false});
        }))
    }
}
const $opNav = (reference) => (event) => {
    Ux.prevent(event);
    const {$router} = reference.props;
    const {$role} = reference.state;
    if ($router && $role) {
        const target = $router.path();
        const params = {};
        params.ownerType = "ROLE";
        params.ownerId = $role.roleId;
        params.name = $role['roleName'];
        const targetKey = Ux.encryptBase64(JSON.stringify(params));
        Ux.toRoute(reference, `/authority/view`, {
            target, targetKey,
        });
    }
}
const $opExport = (reference) => (event) => {
    Ux.prevent(event);
    Ex.uiDialog(reference, __dialog => __dialog.onOpen({
        type: "EXPORT"
    }))
}
const $opImport = (reference) => (event) => {
    Ux.prevent(event);
    Ex.uiDialog(reference, __dialog => __dialog.onOpen({
        type: "IMPORT"
    }))
}
export default {
    $opExport,
    $opImport,
    $opSelect,
    $opNav,
    $opSave,
}