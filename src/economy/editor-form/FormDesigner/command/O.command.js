import Ux from 'ux';
import Op from '../op';

const showPopover = (reference, item) => {
    // 屏蔽主操作
    reference.setState({
        $forbidden: true,    // 禁止屏幕主操作
        $popover: item.key,  // 打开 Popover
    });
}
const showWindow = (reference, item) => {
    reference.setState({
        $window: item.key,      // 关联窗口 id
        $visible: true,         // 打开 窗口
        $forbidden: true,       // 禁止屏幕主操作
    });
}
const showRowDrawer = (reference, item, config = {}) => {
    let {rowIndex} = config;
    reference.setState({
        $drawer: item.key,      // 打开 Popover
        $setting: {
            type: "row",
            className: "web-form-row-drawer",
            rowIndex,
        }
    })
}
const showCellDrawer = (reference, item, config = {}) => {
    reference.setState({
        $drawer: item.key,      // 打开 Popover
        $setting: {
            type: "cell",
            className: "web-form-cell-drawer",
            rowIndex: config.rowIndex,
            cellIndex: config.cellIndex,
        }
    });
}
/*
 * 绘图过程中添加行操作
 */
const rowAdd = (reference, item, config) => {
    const {rowIndex} = config;
    Ux.fn(reference).rxRowAdd(rowIndex);
}
const rowDel = (reference, item, config) => {
    const {rowIndex} = config;
    Ux.fn(reference).rxRowDel(rowIndex);
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
    Ux.fn(reference).rxCellMerge(cellIndex);
}
const cellDel = (reference, item, config) => {
    const {cellIndex} = config;
    Ux.fn(reference).rxCellDel(cellIndex);
}
const cellSplit = (reference, item, config) => {
    const {cellIndex} = config;
    Ux.fn(reference).rxCellSplit(cellIndex);
}
const cellFill = (reference, item, config) => {
    const {cellIndex} = config;
    Ux.fn(reference).rxCellFill(cellIndex);
}
const cellAdd = (reference) => {
    Op.rxCellAdd(reference)();
}
export default {
    // 主操作
    export: showWindow,
    import: showWindow,
    preview: showWindow,

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