import Q from "q";
import Ux from 'ux';
import Fx from '../Fx';

const _initPromise = (reference) => {
    const {$MOCK_COLUMN = {}} = reference.props;
    const {FULL = {}, CURRENT = {}} = $MOCK_COLUMN;
    const {options = {}} = reference.state;
    /*
     * 加载两种信息
     * 1. 当前模块可以访问的全信息
     * 2. 当前视图个人保存信息
     */
    const params = {module: options['column.module']};
    const fullPromise = Ux.ajaxGet(options['ajax.column.full'], params, FULL);
    const myPromise = Ux.ajaxGet(options['ajax.column.my'], params, CURRENT);
    const promise = [];
    promise.push(fullPromise);
    promise.push(myPromise);
    /*
     * 使用 Q
     */
    return Q.all(promise);
};

const _normalizeArray = (projection = []) => {
    const items = [];
    projection.forEach(pItem => {
        const item = {};
        item.key = pItem.dataIndex;
        item.label = pItem.title;
        items.push(item);
    });
    return items;
};

const _initProjection = (reference) => (response = []) => {
    const columns = response[0];
    const projection = _normalizeArray(columns);
    const projectionCurrent = _normalizeArray(response[1]);
    const updatedState = Fx.etatProjection(reference, projectionCurrent);
    /* 注意 */
    reference.setState({
        columns, projection,
        ...updatedState,
        readyColumn: true,
    });
};

const initColumn = (reference) => {
    const {options = {}, readyColumn = false} = reference.state;
    if (options['column.dynamic'] && !readyColumn) {
        const {readyColumn = false} = reference.state;
        /* 只读取一次列信息 */
        if (!readyColumn) {
            _initPromise(reference)
                .then(_initProjection(reference));
        }
    } else {
        reference.setState({ready: true});
    }
};
export default {
    initColumn
}