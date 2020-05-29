import Ux from "ux";

export default {
    rxCellMerge: (reference) => (cellIndex) => {
        const {$cells = []} = reference.state;
        // 当前索引：cellIndex
        // 前一个索引：cellIndex - 1
        const preIndex = cellIndex - 1;
        const curIndex = cellIndex;
        const replaced = [];
        let appendSpan = 0;
        for (let idx = $cells.length - 1; idx >= 0; idx--) {
            if (curIndex === idx) {
                appendSpan = $cells[idx].span;
                continue;
            }
            const append = Ux.clone($cells[idx]);
            if (preIndex === idx) {
                append.span += appendSpan;
            }
            // 更改列索引
            replaced.push(append);
        }
        /*
         * 最后需要反序，并且更新列索引
         */
        const revered = replaced.reverse();
        revered.forEach((item, index) => item.cellIndex = index);
        reference.setState({$cells: revered});
    },
    rxCellDel: (reference) => (cellIndex) => {
        const {$cells = []} = reference.state;
        let replaced = $cells.filter((item, index) => index !== cellIndex);
        replaced.forEach((item, index) => item.cellIndex = index);
        replaced = Ux.clone(replaced);
        reference.setState({$cells: replaced});
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
    rxRowAdd: (reference) => (rowIndex) => {
        let {$rows = []} = reference.state;
        $rows = Ux.clone($rows);
        /* 在指定位置插入 */
        if (undefined === rowIndex) {
            rowIndex = $rows.length - 1;
        }
        $rows.splice(rowIndex, 0, {});
        reference.setState({$rows});
    },
    rxSettingClose: (reference) => (event) => {
        Ux.prevent(event);
        reference.setState({
            $drawer: undefined,
            $setting: undefined
        })
    }
}
