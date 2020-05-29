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
        const key = `row-${Ux.randomString(8)}`;
        state.$rows = [{
            key,
        }];
        reference.setState(state);
    },
    yiRow: (reference) => {
        const state = {};
        Cmn.yiCommand(reference, state)
            .then(processed => Cmn.yiRowCell(reference, processed))
            .then(Ux.ready).then(Ux.pipe(reference))
    },
    yiCell: (reference) => {
        /*
         * 特殊按钮
         */
        const state = {};
        Cmn.yiCommand(reference, {}, "merge")
            .then(processed => {
                if (Ux.isArray(processed.$commands)) {
                    const $merge = processed.$commands[0];
                    if ($merge) {
                        state.$merge = $merge;
                    }
                }
                return Ux.promise(state);
            })
            .then(processed => Cmn.yiCommand(reference, processed))
            .then(Ux.ready).then(Ux.pipe(reference))
    },
    ...yo,
    ...event
}