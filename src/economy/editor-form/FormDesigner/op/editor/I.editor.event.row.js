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
        Cmn.rowsRefresh(reference, $rows);
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
        Cmn.rowsRefresh(reference, $rows);
    },
    rxRowConfig: (reference) => (rows = []) => {
        let {$rows = []} = reference.state;
        /*
         * 同构
         * {
         *      "key": "xxx",
         *      "data": []
         * }
         */
        $rows = Ux.clone($rows);
        $rows = Ux.elementJoin($rows, rows);
        /*
         * 旧代码：reference.setState({$rows: $rows});
         * 由于此处调用 onUi 会直接更新父类，所以不用子类单独更新
         * 直接使用父类驱动子类的更新流程更合适
         */
        Cmn.rowsRefresh(reference, $rows);
    },
    rxRowAdd: (reference) => (rowIndex) => {
        let {$rows = []} = reference.state;
        $rows = Ux.clone($rows);
        /* 在指定位置插入 */
        if (undefined === rowIndex) {
            rowIndex = $rows.length - 1;
        }
        $rows.splice(rowIndex + 1, 0, {
            key: `row-${Ux.randomString(8)}`,
            data: []
        });
        Cmn.rowsRefresh(reference, $rows);
    },
    rxRowFill: (reference) => (rowIndex) => {
        const data = Cmn.cellWidth(reference, false);
        Cmn.rowRefresh(reference, data);
    },
    rxRowCompress: (reference) => (rowIndex) => {
        const data = Cmn.cellWidth(reference, true);
        Cmn.rowRefresh(reference, data);
    }
}