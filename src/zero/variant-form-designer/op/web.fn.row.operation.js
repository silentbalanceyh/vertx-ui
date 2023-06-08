import {Dsl} from 'entity';
import Cl from './web.fn.cell.element';
import Rft from "./event.fn.raft";
import __Zn from '../zero.uca.dependency';
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
            const changed = __Zn.clone(each);
            const cellData = Cl.cellConfig(reference, {
                ...changed,
                length: data.length,        // 长度处理
            });
            normalized.push(cellData);
        });
        const {config = {}} = reference.props;
        const rowConfig = {};
        rowConfig.key = config.key;
        rowConfig.data = normalized;
        __Zn.fn(reference).rxRowConfig([rowConfig]);
    },
    rowsRefresh: (reference, $rows = []) => {
        /*
         * 在父类中创建 $rows 变量
         */
        const ref = __Zn.onReference(reference, 1);
        if (ref) {
            Rft.raft(ref).onUi($rows);
        }
    },
    rowSave
}