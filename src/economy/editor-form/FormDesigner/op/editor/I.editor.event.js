import Ux from "ux";
import CellEvent from './I.editor.event.cell';
import RowEvent from './I.editor.event.row';

export default {
    ...RowEvent,
    ...CellEvent,
    rxSettingClose: (reference) => (event) => {
        Ux.prevent(event);
        reference.setState({
            $drawer: undefined,
            $setting: undefined
        })
    },
    /*
     * 专用合并函数
     */
    rxRequest: (reference) => {
        /* 旧数据 */
        const {raft = {}, child} = reference.state;
        if (child && child.state) {
            const updated = child.state.$rows;
            /* 新旧数据合并 */
            const uiGrid = [];
            updated.forEach((row, rowIndex) => {
                const uiRow = [];
                row.data.forEach((cell, cellIndex) => {
                    /* 双层检查 */
                    if (rowIndex === cell.rowIndex
                        && cellIndex === cell.cellIndex) {
                        /* 数据转换 */
                        const normalized = Ux.clone(cell.data);
                        normalized.span = cell.span;
                        uiRow.push(normalized);
                    }
                });
                uiGrid.push(uiRow);
            });
            const $raft = Ux.clone(raft);
            if ($raft.form) {
                $raft.form.ui = uiGrid;
            }
            return $raft;
        }
        return {};
    }
}
