import Cmn from './web.entry'
import rxCellWrap from './editor.__.@fn._.cell.wrap';
import rxCellConfig from './editor.__.@fn._.cell';
import __Zn from '../zero.uca.dependency';

export default {
    rxCellConfig,
    rxCellRefresh: (reference) => (data = []) =>
        Cmn.rowRefresh(reference, data),
    rxCellMerge: (reference) => (cellIndex) => {
        const {data = []} = reference.props;
        // 当前索引：cellIndex
        // 前一个索引：cellIndex - 1
        const preIndex = cellIndex - 1;
        const curIndex = cellIndex;
        const replaced = [];
        let appendSpan = 0;
        for (let idx = data.length - 1; idx >= 0; idx--) {
            if (curIndex === idx) {
                appendSpan = data[idx].span;
                continue;
            }
            const append = __Zn.clone(data[idx]);
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
        Cmn.rowRefresh(reference, revered);
    },
    rxCellDel: (reference) => (cellIndex) => {
        const {data = []} = reference.props;
        let replaced = data.filter((item, index) => index !== cellIndex);
        replaced.forEach((item, index) => item.cellIndex = index);
        replaced = __Zn.clone(replaced);
        Cmn.rowRefresh(reference, replaced);
    },
    rxCellWrap,
    rxCellFill: (reference) => (cellIndex) => {
        let {data = []} = reference.props;
        const spans = Cmn.cellSpans(data);
        const added = 24 - spans;
        if (0 < added) {
            data = __Zn.clone(data);
            data.filter((item, index) => cellIndex === index)
                .forEach(item => {
                    item.span += added;
                });
            Cmn.rowRefresh(reference, data);
        }
    },
    rxCellSplit: (reference) => (cellIndex) => {
        const {data = []} = reference.props;
        let added = [];
        data.forEach((cell, index) => {
            if (cellIndex === index) {
                const calculated = cell.span / 2;
                cell.span = calculated;
                added.push(__Zn.clone(cell));
                /* 再添加一个 */
                added.push({span: calculated, key: `cell-${__Zn.randomString(8)}`});
            } else {
                added.push(__Zn.clone(cell));
            }
        });
        added.forEach((item, index) => item.cellIndex = index);
        Cmn.rowRefresh(reference, added);
    },
    /* 注意这里的 reference 是行引用 */
    rxCellAdd: (reference) => () => {
        const {config = {}, data = []} = reference.props;
        const cell = Cmn.cellNew(config.span, config);
        /* 直接添加一个新的单元格 */
        const $data = __Zn.clone(data);
        // 行操作，直接追加
        $data.push(cell);
        $data.forEach((item, index) => item.cellIndex = index);
        Cmn.rowRefresh(reference, $data);
    },
    rxCellSelect: (reference) => (event) => {
        const {config = {}} = reference.props;
        const state = {};
        state.$drawer = "control";
        state.$setting = {
            type: "cell",
            className: "web-form-cell-drawer",
            rowIndex: config.rowIndex,
            cellIndex: config.cellIndex,
        };
        __Zn.of(reference).in(state).done();
        // reference.?etState(state);
    },
    rxCellField: (reference) => (event) => {
        __Zn.of(reference).open().done();
        // reference.?etState({$visible: true});
    }
}