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
const rxPageChecked = (reference) => (addedKeys = [], removedKeys = []) => {
    let {$keySet} = reference.state;
    if ($keySet) {
        $keySet = Ux.clone($keySet);
        addedKeys.forEach(key => $keySet.add(key));
        removedKeys.forEach(key => $keySet.delete(key));
        reference.setState({$keySet});
    }
}
const rxPageSelect = (reference) => (key, $selectedData = []) => {
    const state = {};
    state.$selectedKeys = key ? [key] : [];
    state.$selectedData = $selectedData;
    reference.setState(state);
}
const rxPageMove = (reference) => (key) => {
    reference.setState({
        $selectedKeys: [],
        $selectedData: []
    });
}
export default {
    rxExport,
    rxImport,
    rxPageChecked,
    rxPageSelect,
    rxPageMove
}