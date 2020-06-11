import Ux from "ux";
import CellEvent from './I.editor.event.cell';
import RowEvent from './I.editor.event.row';
import {Dsl} from 'entity';
import Ld from '../library';

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
    rxModelSave: (reference) => (attribute = {}) => {
        let {$models = {}} = reference.state;
        if (!Ux.isArray($models.attributes)) {
            $models.attributes = [];
        }
        /* 数据处理 */
        const attr = Dsl.getArray($models.attributes);
        attr.saveElement(attribute);
        $models = Ux.clone($models);
        $models.attributes = attr.to();
        /* 处理 $models 更新 */
        const state = Ux.clone(reference.state);
        Ld.yiModel(state, $models).then(processed => reference.setState(processed));
    },
    rxDataSave: (reference) => (updated = {}) => {
        let {raft} = reference.state;
        raft = Ux.clone(raft);
        const {form = {}} = raft;
        if (Ux.isArray(updated.ui) && Ux.isArray(form.ui)) {
            updated.ui.forEach((row, rindex) => row.forEach((cell, cindex) => {
                let cellRef = form.ui[rindex];
                if (cellRef) {
                    cellRef = cellRef[cindex];
                    if (cellRef) {
                        cellRef.raft = Ux.clone(cell);
                    }
                }
            }))
        }
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
        const {raft = {}} = reference.state;
        /* 格式化 ui */
        const $raft = Ux.clone(raft);
        if (raft.form && raft.form.ui) {
            const $uiGrid = [];
            raft.form.ui.forEach(each => {
                const $uiRow = [];
                each.forEach(cell => {
                    if (cell.raft) {
                        $uiRow.push(Ux.clone(cell.raft));
                    }
                });
                $uiGrid.push($uiRow);
            });
            $raft.form.ui = $uiGrid;
        }
        return Ux.clone($raft);
    }
}
