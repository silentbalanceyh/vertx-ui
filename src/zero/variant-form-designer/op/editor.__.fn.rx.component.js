import CellEvent from './editor.__.fn.rx.cell.action';
import RowEvent from './editor.__.fn.rx.row.action';
import {Dsl} from 'entity';
import Ld from './web.entry';
import __Zn from '../zero.uca.dependency';

export default {
    ...RowEvent,
    ...CellEvent,
    rxSettingClose: (reference) => (event) => {
        __Zn.prevent(event);
        __Zn.of(reference).in({
            $drawer: undefined,
            $setting: undefined
        }).done()
        // reference.?etState({
        //     $drawer: undefined,
        //     $setting: undefined
        // })
    },
    rxWindowClose: (reference) => (event) => {

        __Zn.of(reference).in({
            $window: undefined,      // 关联窗口 id
            $visible: false,         // 打开 窗口
            $forbidden: false,       // 禁止屏幕主操作
        }).done()
        // reference.?etState({
        //     $window: undefined,      // 关联窗口 id
        //     $visible: false,         // 打开 窗口
        //     $forbidden: false,       // 禁止屏幕主操作
        // })
    },
    rxModelSave: (reference) => (attribute = {}) => {
        let {$models = {}} = reference.state;
        if (!__Zn.isArray($models.attributes)) {
            $models.attributes = [];
        }
        /* 数据处理 */
        const attr = Dsl.getArray($models.attributes);
        attr.saveElement(attribute);
        $models = __Zn.clone($models);
        $models.attributes = attr.to();
        /* 处理 $models 更新 */
        const state = __Zn.clone(reference.state);
        Ld.yiModel(state, $models).then(processed => {

            __Zn.of(reference).in(processed).done();
            // reference.?etState(processed)
        });
    },
    rxDataSave: (reference) => (updated = {}) => {
        let {raft} = reference.state;
        raft = __Zn.clone(raft);
        const {form = {}} = raft;
        if (__Zn.isArray(updated.ui) && __Zn.isArray(form.ui)) {
            updated.ui.forEach((row, rindex) => row.forEach((cell, cindex) => {
                let cellRef = form.ui[rindex];
                if (cellRef) {
                    cellRef = cellRef[cindex];
                    if (cellRef) {
                        cellRef.raft = __Zn.clone(cell);
                    }
                }
            }))
        }
        // reference.?etState({
        //     raft,                    // 相关配置信息
        //     $window: undefined,      // 关联窗口 id
        //     $visible: false,         // 打开 窗口
        //     $forbidden: false,       // 禁止屏幕主操作
        // })
        __Zn.of(reference).in({
            raft,                    // 相关配置信息
            $window: undefined,      // 关联窗口 id
            // $visible: false,         // 打开 窗口
            $forbidden: false,       // 禁止屏幕主操作
        }).hide().done()
    },
    /*
     * 数据合并专用函数
     */
    rxDataRequest: (reference) => {
        const {raft = {}} = reference.state;
        /* 格式化 ui */
        const $raft = __Zn.clone(raft);
        if (raft.form && raft.form.ui) {
            const $uiGrid = [];
            raft.form.ui.forEach(each => {
                const $uiRow = [];
                each.forEach(cell => {
                    if (cell.raft) {
                        $uiRow.push(__Zn.clone(cell.raft));
                    }
                });
                $uiGrid.push($uiRow);
            });
            $raft.form.ui = $uiGrid;
        }
        return __Zn.clone($raft);
    }
}
