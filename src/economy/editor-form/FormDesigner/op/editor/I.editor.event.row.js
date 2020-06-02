import Ux from "ux";
import Cmn from '../library';

export default {

    rxRowWrap: (reference) => (fromIndex, toIndex) => {
        let {$rows = []} = reference.state;
        $rows = Ux.clone($rows);
        /* 中间对象 */
        const targetRow = Ux.clone($rows[toIndex]);
        $rows[toIndex] = Ux.clone($rows[fromIndex]);
        $rows[fromIndex] = targetRow;
        reference.setState({$rows});
    },
    rxRowDel: (reference) => (rowIndex) => {
        let {$rows = []} = reference.state;
        $rows = Ux.clone($rows);
        if (1 < $rows.length) {
            /* 删除指定行 */
            $rows = $rows.filter((row, index) => rowIndex !== index);
        } else {
            /* 清空当前行数据 */
            $rows[0] = {};
        }
        reference.setState({$rows});
    },
    rxRowConfig: (reference) => (rowData = {}) => {
        const {$rows = []} = reference.state;
        const {config = {}, data = []} = rowData;
        const $updated = [];
        $rows.forEach(row => {
            if (config.key === row.key) {
                const rowItem = {};
                rowItem.key = row.key;
                rowItem.data = data;
                $updated.push(rowItem);
            } else {
                $updated.push(Ux.clone(row));
            }
        });
        reference.setState({$rows: $updated});
    },
    rxRowAdd: (reference) => (rowIndex) => {
        let {$rows = []} = reference.state;
        $rows = Ux.clone($rows);
        /* 在指定位置插入 */
        if (undefined === rowIndex) {
            rowIndex = $rows.length - 1;
        }
        $rows.splice(rowIndex + 1, 0, {
            key: `row-${Ux.randomString(8)}`
        });
        reference.setState({$rows});
    },
    rxRowFill: (reference) => (rowIndex) => {
        const $cells = Cmn.cellWidth(reference, false);
        Cmn.rowRefresh(reference, $cells);
    },
    rxRowCompress: (reference) => (rowIndex) => {
        const $cells = Cmn.cellWidth(reference, true);
        Cmn.rowRefresh(reference, $cells);
    }
}