import Cmn from "../library";
import Ux from 'ux';
import event from './I.editor.event';
import yo from './I.editor.yo';

const yiData = (reference, state = {}) => {
    /* 初始化行专用操作 */
    const key = `row-${Ux.randomString(8)}`;
    const {data = {}} = reference.props;
    const span = 24 / data.columns;     // 计算列宽度
    state.$config = Ux.clone(data);     // 原始配置

    const $rows = [];
    {
        /* 处理 $rows */
        if (data.ui && 0 < data.ui.length) {
            data.ui.forEach(row => {
                /* 行专用 key 提取 */
                const rowKeySet = new Set();
                row.map(cell => cell.config)
                    .forEach(config => rowKeySet.add(config.rowKey));
                const rowKeys = Array.from(rowKeySet);
                const rowKey = rowKeys[0];
                /* 行初始化 */
                const rowReady = {};
                rowReady.key = rowKey;
                rowReady.data = Ux.clone(row);
                $rows.push(rowReady);
            });
        } else {
            $rows.push({
                key,
                /* 修改节点 */
                data: [Cmn.cellNew(span, {
                    rowIndex: 0,
                    key,
                })]
            })
        }
    }

    /* 原始配置 */
    state.$rows = $rows;
    return Ux.promise(state);
}

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
                    && config.hasOwnProperty("columns")) {
                    $inited.columns = `${config.columns}`;
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