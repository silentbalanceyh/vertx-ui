import Cmn from "./I.common.yi";
import Ux from 'ux';
import event from './I.editor.event';
import yo from './I.editor.yo';

export default {
    /*
     * 网格初始化
     */
    yiGrid: (reference) => {
        // const {data = {}} = reference.props;
        /* 初始化配置信息 */
        /* Form数据处理 */
        const state = {};
        /* _commands 命令工具栏 */
        state.$ready = true;

        /* 初始化行专用操作 */
        state.$rows = [{}];
        reference.setState(state);
    },
    yiRow: (reference) => {
        const state = {};
        Cmn.yiCommand(reference, state)
            .then(processed => Cmn.yiRowCell(reference, processed))
            .then(Ux.ready).then(Ux.pipe(reference))
    },
    yiCell: (reference) => {
        const state = {};
        Cmn.yiCommand(reference, state)
            .then(Ux.ready).then(Ux.pipe(reference))
    },
    ...yo,
    ...event
}