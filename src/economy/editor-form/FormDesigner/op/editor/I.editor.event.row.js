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
        reference.setState({$rows: $rows});
        /*
         * 在父类中创建 $rows 变量
         */
        const ref = Ux.onReference(reference, 1);
        if (ref) {
            ref.setState({$ui: $rows});
        }
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
        reference.setState({$rows});
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