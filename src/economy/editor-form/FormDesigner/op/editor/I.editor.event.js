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

    }
}
