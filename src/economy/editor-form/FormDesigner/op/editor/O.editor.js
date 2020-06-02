import Cmn from "../library";
import Ux from 'ux';
import event from './I.editor.event';
import yo from './I.editor.yo';
import yiData from './I.editor.yi.data';

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

        yiData(reference, state).then(Ux.pipe(reference));
    },
    yiRow: (reference) => {
        const state = {};
        Cmn.yiCommand(reference, {}, "extra")
            .then(processed => {
                state.$extra = processed.$commands;
                return Ux.promise(state);
            })
            .then(processed => {
                const {$inited = {}} = reference.state;
                const {config = {}} = reference.props;
                if (!$inited.hasOwnProperty("columns")
                    && config.hasOwnProperty("grid")) {
                    $inited.columns = `${config.grid}`;
                }
                $inited.type = "WEB";
                processed.$inited = $inited;
                return Ux.promise(processed);
            })
            .then(processed => Cmn.yiCommand(reference, processed))
            // .then(processed => Cmn.yiRowCell(reference, processed))
            .then(Ux.ready).then(Ux.pipe(reference))
    },
    yiCell: (reference) => {
        /*
         * 特殊按钮
         */
        const state = {};
        Cmn.yiCommand(reference, {}, "merge")
            .then(processed => {
                const $merge = processed.$commands[0];
                if ($merge) {
                    state.$merge = $merge;
                }
                return Ux.promise(state);
            })
            .then(processed => Cmn.yiCommand(reference, processed))
            .then(Ux.ready).then(Ux.pipe(reference))
    },
    ...yo,
    ...event
}