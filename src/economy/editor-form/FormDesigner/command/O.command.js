import Ux from 'ux';

const showPopover = (reference, item) => {
    // 屏蔽主操作
    reference.setState({
        $forbidden: true,    // 禁止屏幕主操作
        $popover: item.key,  // 打开 Popover
    });
}
/*
 * 绘图过程中添加行操作
 */
const rowAdd = (reference, item, config) => {
    let {rowIndex} = config;
    Ux.fn(reference).rxRowAdd(rowIndex);
}

export default {
    layout: showPopover,
    "deployment-unit": showPopover,
    "eye-invisible": showPopover,
    code: showPopover,
    database: showPopover,
    // 画布上的操作
    "plus-circle": rowAdd,
}