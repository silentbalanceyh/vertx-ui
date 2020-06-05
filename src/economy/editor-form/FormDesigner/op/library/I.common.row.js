import Ux from 'ux';
import {Dsl} from 'entity';
import Cl from './I.common.cell';
/*
 * reference 引用的是 Row
 */
const rowSave = (reference, cellData = {}) => {
    const {data = []} = reference.props;
    const $data = Dsl.getArray(data);
    $data.saveElement(cellData);
    // 返回最终的 rowData
    const rowData = {};
    rowData.key = cellData.rowKey;
    rowData.data = $data.to();
    return rowData;
}
export default {
    /*
     * 这里的 reference 是 Row
     */
    rowRefresh: (reference, data = []) => {
        /*
         * 先执行 normalized（变更 span，重算 raft ）
         */
        const normalized = [];
        data.forEach(each => {
            const changed = Ux.clone(each);
            const cellData = Cl.cellConfig(reference, changed);
            normalized.push(cellData);
        });
        const {config = {}} = reference.props;
        const rowConfig = {};
        rowConfig.key = config.key;
        rowConfig.data = normalized;
        Ux.fn(reference).rxRowConfig([rowConfig]);
    },
    rowSave
}