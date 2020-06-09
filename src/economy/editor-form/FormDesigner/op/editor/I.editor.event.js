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
    rxWindowClose: (reference) => (event) => {
        reference.setState({
            $window: undefined,      // 关联窗口 id
            $visible: false,         // 打开 窗口
            $forbidden: false,       // 禁止屏幕主操作
        })
    },
    rxDataSave: (reference) => (raft) => {
        reference.setState({
            raft,                    // 相关配置信息
            $window: undefined,      // 关联窗口 id
            $visible: false,         // 打开 窗口
            $forbidden: false,       // 禁止屏幕主操作
        })
    },
    /*
     * 数据合并专用函数
     */
    rxDataRequest: (reference) => {
        /* 旧数据 */
        const {raft = {}, $ui} = reference.state;
        if ($ui && Ux.isArray($ui)) {
            /* 新旧数据合并 */
            const uiGrid = [];
            $ui.forEach((row, rowIndex) => {
                const uiRow = [];
                row.data.forEach((cell, cellIndex) => {
                    /* 双层检查 */
                    if (rowIndex === cell.rowIndex && cellIndex === cell.cellIndex) {
                        /* 已配置了数据 */
                        if (cell.data) {
                            /* 数据转换 */
                            const normalized = Ux.clone(cell.data);
                            normalized.span = cell.span;
                            /* 必须包含 field */
                            if (normalized.field) {
                                uiRow.push(normalized);
                            }
                        }
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
