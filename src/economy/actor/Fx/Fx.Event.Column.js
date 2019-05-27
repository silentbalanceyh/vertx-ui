import Unity from "./Fx.Unity";
import Ux from 'ux';
import U from 'underscore';

const _rxSaveMock = (reference, selected = []) => {
    const {$MOCK_COLUMN = {}} = reference.props;
    const {CURRENT, FULL} = $MOCK_COLUMN;
    if (CURRENT) {
        const $selected = Ux.immutable(selected);
        const original = Ux.clone(FULL.data);
        // 添加还是删除
        const data = [];
        original.filter(item => $selected.contains(item.dataIndex))
            .forEach(item => {
                const dataItem = {};
                dataItem.key = item.dataIndex;
                dataItem.label = item.title;
                data.push(dataItem);
            });
        return {
            mock: CURRENT.mock,
            data
        };
    } else {
        return {mock: false};
    }
};
const rxSaveColumn = (reference) => (event) => {
    event.preventDefault();
    // 提交表单
    Unity.doSubmit(reference);
    // 保存专用（修改显示列）
    const {$options = {}} = reference.props;
    const {$selected = []} = reference.state;
    return Ux.ajaxPut($options['ajax.column.save'], {}, _rxSaveMock(reference, $selected)).then(response => {
        if (U.isArray(response)) {
            Unity.doSubmit(reference, false);
            Unity.doSaveColumn(reference, response);
            Unity.doClose(reference);
        }
    });
};
const rxExport = (reference) => (event) => {
    event.preventDefault();
    // 提交表单
    Unity.doSubmit(reference);
    // 导出专用

};
export default {
    rxSaveColumn,
    rxExport,
}