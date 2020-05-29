import Ux from 'ux';

const showPopover = (reference, item) => {
    // 屏蔽主操作
    reference.setState({
        $forbidden: true,    // 禁止屏幕主操作
        $popover: item.key,  // 打开 Popover
    });
}
const showRowDrawer = (reference, item, config = {}) => {
    let {rowIndex} = config;
    reference.setState({
        $drawer: item.key,      // 打开 Popover
        $setting: {
            type: "row",
            className: "web-form-designer-drawer",
            rowIndex,
        }
    })
}
const showCellDrawer = (reference, item, config = {}) => {
    reference.setState({
        $drawer: item.key,      // 打开 Popover
    });
}
/*
 * 绘图过程中添加行操作
 */
const rowAdd = (reference, item, config) => {
    let {rowIndex} = config;
    Ux.fn(reference).rxRowAdd(rowIndex);
}
const rowDel = (reference, item, config) => {
    let {rowIndex} = config;
    Ux.fn(reference).rxRowDel(rowIndex);
}
const cellMerge = (reference, item, config) => {
    let {cellIndex} = config;
    Ux.fn(reference).rxCellMerge(cellIndex);
}
const cellDel = (reference, item, config) => {
    let {cellIndex} = config;
    Ux.fn(reference).rxCellDel(cellIndex);
}
export default {
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
    // 行配置
    setting: showRowDrawer,
    // 单元格配置
    control: showCellDrawer,
    // 合并单元格
    "merge-cell": cellMerge,
    // 删除单元格
    "delete": cellDel,
}