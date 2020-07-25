import Ux from 'ux';
import Ex from 'ex';
import {saveAs} from 'file-saver'

const rxExport = (reference) => (params) => {
    const ref = Ux.onReference(reference, 1);
    const {$keySet, $role} = ref.state;
    if ($keySet && $role) {
        if (params.filename) {
            Ex.uiDialog(reference, __dialog => {
                // 防重复提交
                __dialog.onSubmit({$loading: true});
                const exportData = ["roleId,permId"];
                const permissions = Array.from($keySet);
                permissions.forEach(permission => {
                    exportData.push(`${$role['roleId']},${permission}`);
                });
                // 提取文件名
                const file = new File(
                    [exportData.join('\r\n')],
                    `${params.filename}.csv`,
                    {type: "text/plain;charset=utf-8"});
                saveAs(file);
                // 关闭窗口
                __dialog.onClose();
            })
        } else {
            Ux.sexMessage(ref, "filename");
        }
    }
}
const rxImport = (reference) => (params) => {
    const {$fileData} = reference.state;
    if ($fileData) {
        Ex.uiDialog(reference, __dialog => {
            // 防重复提交
            __dialog.onSubmit({$loading: true});
            const reader = new FileReader();
            reader.readAsText($fileData);
            reader.onload = function () {
                const content = reader.result;
                const lines = content.split("\r\n");
                const permissions = new Set();
                lines.forEach(line => {
                    const normalized = line.replace(/( |\\n|\\r)/g, "");
                    const item = normalized.split(',');
                    const permId = item[1];
                    if (36 === permId.length) {
                        permissions.add(item[1]);
                    }
                });
                __dialog.onClose({$keySet: permissions});
            }
        });
    } else {
        Ux.sexMessage(reference, "empty");
        reference.setState({$submitting: false, $loading: false});
    }
}
const toPermKeys = (reference) => {
    const result = {
        length: 0,
        data: []
    };
    const dashboard = Ux.fromHoc(reference, "dashboard");
    if (dashboard) {
        const {permissions = []} = dashboard;
        // 先提取权限信息
        const $codes = Ux.immutable(permissions);
        const {$permissions = []} = reference.state;
        result.data = $permissions
            .filter(item => $codes.contains(item.code))
            .map(item => item.key);
        result.length = result.data.length;
    }
    return result;
}
const rxLogin = (reference) => (event) => {
    const enabled = event.target.checked;
    const {$keySet} = reference.state;
    const perm = toPermKeys(reference);
    const keySet = new Set()
    if ($keySet) {
        Array.from($keySet).forEach(key => keySet.add(key));
    }
    if (enabled) {
        // 允许登录
        perm.data.forEach(added => keySet.add(added));
    } else {
        // 不允许登录
        perm.data.forEach(removed => keySet.delete(removed));
    }
    reference.setState({$keySet: keySet});
}
const isLogin = (reference) => {
    const {$role} = reference.state;
    if ($role) {
        const perm = toPermKeys(reference);
        if (perm.length) {
            const $expected = Ux.immutable(perm.data);
            // 期望信息
            const {$keySet} = reference.state;
            const $keys = $keySet ? Array.from($keySet) : [];
            const filtered = $keys.filter(key => $expected.contains(key));
            return perm.length === filtered.length;
        } else return false;
    }
}
export default {
    rxExport,
    rxImport,
    rxLogin,
    isLogin,
}