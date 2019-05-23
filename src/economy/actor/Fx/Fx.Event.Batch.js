import Unity from './Fx.Unity';
import Mock from './Fx.Mock';
import Ux from 'ux';
/*
* reference 则是 IxOpLink
*  */
const rxBatchDelete = (reference) => () => {
    // 防重复提交
    Unity.doLoading(reference);
    Ux.toLoading(() => {
        const {$options = {}, $selected = []} = reference.props;
        const uri = $options['ajax.batch.delete.uri'];
        const mocker = Unity.doMocker(reference);
        Ux.ajaxDelete(uri, {$body: $selected},
            Mock.mockDeleteWithMocker(reference, $selected, mocker))
            .then(Unity.doDelete(reference,
                // 重新 Refresh，同时会关闭 loading
                () => Unity.doRefresh(reference),
                $selected));
    });
};
const rxBatchEdit = (reference) => (records = []) => {
    // 防重复提交 / Dialog 专用窗口处理
    Unity.doSubmit(reference);
    Unity.doLoading(reference);
    Ux.toLoading(() => {
        const {$options = {}} = reference.props;
        const uri = $options['ajax.batch.put.uri'];
        const mocker = Unity.doMocker(reference);
        Ux.ajaxPut(uri, records,
            Mock.mockUpdateWithMocker(reference, records, mocker))
            .then(Unity.doUpdate(reference,
                () => {
                    // 关闭重复提交
                    Unity.doSubmit(reference, false);
                    // 重新Refresh，同时会关闭 loading
                    Unity.doRefresh(reference);
                    // 关闭窗口
                    Unity.doClose(reference);
                }, records))
    });
};
export default {
    rxBatchDelete,
    rxBatchEdit,
}