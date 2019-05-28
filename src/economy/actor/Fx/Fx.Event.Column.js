import Unity from "./Fx.Unity";
import Ux from 'ux';
import U from 'underscore';
import {saveAs} from "file-saver";
import UI from "./Fx.UI";

const _mockFlow = (reference, supplier) => {
    const {$MOCK_COLUMN = {}, $options = {}} = reference.props;
    const {CURRENT, FULL} = $MOCK_COLUMN;
    if (CURRENT && $options['mock.enabled']) {
        const data = supplier();
        return {
            mock: FULL.mock && CURRENT.mock,
            data
        };
    } else {
        return {mock: false};
    }
};

const _mockColumn = (reference, selected = []) => _mockFlow(reference, () => {
    const {$MOCK_COLUMN = {}} = reference.props;
    const {FULL} = $MOCK_COLUMN;
    const $selected = Ux.immutable(selected);
    const original = Ux.clone(FULL.data);
    // 添加还是删除
    return original.filter(item => $selected.contains(item.dataIndex));
});
const _mockDownload = (reference) =>
    _mockFlow(reference, () => require('./download/demo.xlsx'));

const rxSaveColumn = (reference) => (event) => {
    event.preventDefault();
    // 提交表单
    Unity.doSubmit(reference);
    // 保存专用（修改显示列）
    const {$options = {}} = reference.props;
    const {$selected = []} = reference.state;
    return Ux.ajaxPut($options['ajax.column.save'], {}, _mockColumn(reference, $selected)).then(response => {
        if (U.isArray(response)) {
            /* 重复提交完成 */
            Unity.doSubmit(reference, false);
            /* 更新列基本信息 */
            Unity.doSaveColumn(reference, response);
            // 成功消息提示
            UI.jsxSuccess(reference);
            /* 关闭浮游 */
            Unity.doClose(reference);
        }
    });
};
const rxExport = (reference) => (event) => {
    event.preventDefault();
    // 提交表单
    Unity.doSubmit(reference);
    // 导出专用（根据选中列导出）
    const {$options = {}} = reference.props;
    const {$selected = []} = reference.state;
    // 参数信息
    const params = {
        columns: $selected,
        format: 'xlsx',     // TODO: 后边支持多种格式
    };
    return Ux.ajaxPull($options['ajax.file.export'], params, _mockDownload(reference))
        .then(file => {
            // 重复提交完成
            Unity.doSubmit(reference, false);
            // 下载保存
            saveAs(file, `${Ux.randomUUID()}.${params.format}`);
            // 成功消息提示
            UI.jsxSuccess(reference);
            /* 关闭浮游 */
            Unity.doClose(reference);
        });
};
export default {
    rxSaveColumn,
    rxExport,
};