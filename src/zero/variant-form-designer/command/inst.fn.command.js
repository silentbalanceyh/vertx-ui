import Op from '../op';
import __Zn from '../zero.uca.dependency';

const showPopover = (reference, item) => {
    // 屏蔽主操作
    // reference.?etState({
    //     $forbidden: true,    // 禁止屏幕主操作
    //     $popover: item.key,  // 打开 Popover
    // });
    __Zn.of(reference).in({
        $forbidden: true,    // 禁止屏幕主操作
        $popover: item.key,  // 打开 Popover
    }).done()
}
const showWindow = (reference, item) => {
    // reference.?etState({
    //     $window: item.key,      // 关联窗口 id
    //     $visible: true,         // 打开 窗口
    //     $popover: undefined,    // 关闭浮游面板（必须的操作，否则会冲突）
    //     $forbidden: true,       // 禁止屏幕主操作
    // });
    __Zn.of(reference).in({
        $window: item.key,      // 关联窗口 id
        // $visible: true,         // 打开 窗口
        $popover: undefined,    // 关闭浮游面板（必须的操作，否则会冲突）
        $forbidden: true,       // 禁止屏幕主操作
    }).open().done()
}
const showRowDrawer = (reference, item, config = {}) => {
    let {rowIndex} = config;
    // reference.?etState({
    //     $drawer: item.key,      // 打开 Popover
    //     $setting: {
    //         type: "row",
    //         className: "web-form-row-drawer",
    //         rowIndex,
    //     }
    // })
    __Zn.of(reference).in({
        $drawer: item.key,      // 打开 Popover
        $setting: {
            type: "row",
            className: "web-form-row-drawer",
            rowIndex,
        }
    }).done()
}
const showCellDrawer = (reference, item, config = {}) => {
    // reference.?etState({
    //     $drawer: item.key,      // 打开 Popover
    //     $setting: {
    //         type: "cell",
    //         className: "web-form-cell-drawer",
    //         rowIndex: config.rowIndex,
    //         cellIndex: config.cellIndex,
    //     }
    // });
    __Zn.of(reference).in({
        $drawer: item.key,      // 打开 Popover
        $setting: {
            type: "cell",
            className: "web-form-cell-drawer",
            rowIndex: config.rowIndex,
            cellIndex: config.cellIndex,
        }
    }).done()
}
/*
 * 绘图过程中添加行操作
 */
const rowAdd = (reference, item, config) => {
    const {rowIndex} = config;
    __Zn.fn(reference).rxRowAdd(rowIndex);
}
const rowDel = (reference, item, config) => {
    const {rowIndex} = config;
    __Zn.fn(reference).rxRowDel(rowIndex);
}
const rowFill = (reference, item, config) => {
    const {rowIndex} = config;
    Op.rxRowFill(reference)(rowIndex);
}
const rowCompress = (reference, item, config) => {
    const {rowIndex} = config;
    Op.rxRowCompress(reference)(rowIndex);
}
const cellMerge = (reference, item, config) => {
    const {cellIndex} = config;
    __Zn.fn(reference).rxCellMerge(cellIndex);
}
const cellDel = (reference, item, config) => {
    const {cellIndex} = config;
    __Zn.fn(reference).rxCellDel(cellIndex);
}
const cellSplit = (reference, item, config) => {
    const {cellIndex} = config;
    __Zn.fn(reference).rxCellSplit(cellIndex);
}
const cellFill = (reference, item, config) => {
    const {cellIndex} = config;
    __Zn.fn(reference).rxCellFill(cellIndex);
}
const cellAdd = (reference) => {
    Op.rxCellAdd(reference)();
}
const rxSubmit = (reference) => {
    /* 调用上层提交函数 */
    let request = Op.rxDataRequest(reference);
    if (request && request.form) {
        request = __Zn.clone(request.form);
        // 全局禁用
        // reference.?etState({
        //     $forbidden: true,        // 全局限制
        //     $window: undefined,     // 所有窗口确认
        //     $popover: undefined,    // 所有浮游窗口确认
        //     $visible: false,        // 所有窗口隐藏
        //     $drawer: undefined      // 所有抽屉确认
        // });
        // const fnReset = () => reference.?etState({$forbidden: false});
        // return __Zn.fn(reference).rxSubmit(request, fnReset);
        return __Zn.of(reference).in({
            $forbidden: true,        // 全局限制
            $window: undefined,     // 所有窗口确认
            $popover: undefined,    // 所有浮游窗口确认
            $visible: false,        // 所有窗口隐藏
            $drawer: undefined      // 所有抽屉确认
        }).future(() => {

            const fnReset = () => {
                __Zn.of(reference).in({
                    $forbidden: false
                }).done()
                // reference.?etState({$forbidden: false})
            };
            return __Zn.fn(reference).rxSubmit(request, fnReset);
        })
    }
}
export default {
    // 提交函数
    save: rxSubmit,
    // 主操作
    export: showWindow,
    import: showWindow,
    preview: showWindow,
    question: showWindow,

    layout: showPopover,
    "deployment-unit": showPopover,
    "eye-invisible": showPopover,
    code: showPopover,
    database: showPopover,

    /*  画布上的操作 */
    // 添加行
    "plus-circle": rowAdd,
    // 删除行
    "minus-circle": rowDel,
    // 扩展行
    "right-square": rowFill,
    // 压缩行
    "left-square": rowCompress,

    // 行配置
    setting: showRowDrawer,
    // 单元格配置
    control: showCellDrawer,

    // 合并单元格
    "merge-cell": cellMerge,
    // 删除单元格
    "delete": cellDel,
    // 拆分单元格
    scissor: cellSplit,
    // 填充单元格
    fullscreen: cellFill,
    // 添加单元格
    "plus-square": cellAdd,
}