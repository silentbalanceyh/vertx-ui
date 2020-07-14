import Ex from "ex";
import Ux from 'ux';
/*
 * 权限控制专用解析
 */
const parseAuthorized = (reference, buttons = {}, options = {}) => {
    // TODO: 权限控制
    /*
     * Open区域
     * Batch区域
     * Search区域
     * Extra区域
     * Row区域
     */
    return Ux.promise(buttons);
};
/*
 * 事件处理专用解析
 */
const parseEvent = (reference, buttons = {}) => {
    /* 添加页签 */
    if (buttons.hasOwnProperty('op.open.add')) {
        const configRef = buttons['op.open.add'];
        configRef.onClick = Ex.rxTabAdd(reference);
    }
    /* 清除 $condition */
    if (buttons.hasOwnProperty('op.open.filter')) {
        const configRef = buttons['op.open.filter'];
        configRef.onClick = Ex.rxCondition(reference, true);
    }
    /* 批量删除 */
    if (buttons.hasOwnProperty('op.batch.delete')) {
        const configRef = buttons['op.batch.delete'];
        configRef.onClick = Ex.rxBatchDelete(reference);
    }
    return Ux.promise(buttons);
};
export default (reference) => ({
    parseAuthorized: (buttons = {}, options) => parseAuthorized(reference, buttons, options),
    parseEvent: (buttons = {}, options) => parseEvent(reference, buttons, options)
});