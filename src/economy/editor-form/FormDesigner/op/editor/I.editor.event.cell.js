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
    rxCellFill: (reference) => (cellIndex) => {
        let {$cells = []} = reference.state;
        const spans = $cells.map(cell => cell.span)
            .reduce((left, right) => left + right, 0);
        const added = 24 - spans;
        if (0 < added) {
            $cells = Ux.clone($cells);
            $cells.filter((item, index) => cellIndex === index)
                .forEach(item => {
                    item.span += added;
                });
            reference.setState({$cells});
        }
    },
    rxCellSplit: (reference) => (cellIndex) => {
        const {$cells = []} = reference.state;
        let added = [];
        $cells.forEach((cell, index) => {
            if (cellIndex === index) {
                const calculated = cell.span / 2;
                cell.span = calculated;
                added.push(Ux.clone(cell));
                /* 再添加一个 */
                added.push({span: calculated, key: `cell-${Ux.randomString(8)}`});
            } else {
                added.push(Ux.clone(cell));
            }
        });
        added.forEach((item, index) => item.cellIndex = index);
        reference.setState({$cells: added});
    },
}