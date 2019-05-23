import Unity from './Fx.Unity';
import Mock from './Fx.Mock';
import Ux from 'ux';
/*
* reference 则是 IxOpLink
*  */
const rxBatchDelete = (reference) => () => {
    Unity.doLoading(reference);
    const {$options = {}, $selected = []} = reference.props;
    const uri = $options['ajax.batch.delete.uri'];
    const mocker = Unity.doMocker(reference);
    Ux.ajaxDelete(uri, {$body: $selected},
        Mock.mockDeleteWithMocker(reference, $selected, mocker))
        .then(Unity.doDelete(reference,
            () => Unity.doRefresh(reference),
            $selected));
};
export default {
    rxBatchDelete
}