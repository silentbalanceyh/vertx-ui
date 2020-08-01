import Is from './O.is';
import Cv from '../constant';

const generator = (reference, names = []) => {
    const object = {};
    names.forEach(name => {
        object[name] = function () {
            let executor;
            if (reference.state) {
                executor = reference.state[name];
            }
            if (Is.isFunction(executor)) {
                return executor.apply(null, arguments);
            } else {
                executor = reference.props[name];
                if (Is.isFunction(executor)) {
                    return executor.apply(null, arguments);
                } else {
                    if (Cv.DEBUG) {
                        console.warn(`${name} function 不存在！`);
                    }
                }
            }
        }
    });
    return object;
}
export default (reference) => generator(reference, [
    /* Ant 系列 */
    "onChange",
    /* Rx 系列 */
    "rxSource",
    "rxSubmit",
    "rxClose",
    "rxFilter",
    "rxTree",

    /* rx特殊模式 */
    "rxNext",        // 下一步
    "rxNextPage",    // 下一页
    "rxPrev",        // 上一步
    "rxPrevPage",    // 上一页
    "rxFirst",       // 第一步
    "rxFirstPage",   // 第一页
    "rxLast",        // 最后一步
    "rxLastPage",    // 最后一页
    "rxAdd",         // 添加
    "rxEdit",        // 编辑
    "rxDelete",      // 删除
    "rxRefresh",     // 刷新
    "rxBack",        // 返回

    "rxChild",       // 绑定子组件专用方法
    /* Designer 系列 */
    "rxRowAdd",     // 添加行
    "rxRowDel",     // 删除行
    "rxRowFill",    // 行扩展
    "rxRowCompress",// 行压缩
    "rxRowWrap",    // 交换行
    "rxRowConfig",  // 行配置，写入顶层的 raft
    /* 单元格系列 */
    "rxCellAdd",    // 添加单元格
    "rxCellMerge",  // 合并单元格
    "rxCellDel",    // 删除单元格
    "rxCellSplit",  // 拆分单元格
    "rxCellFill",   // 填充单元格
    "rxCellWrap",   // 交换单元格
    "rxCellConfig", // 单元格配置
    "rxCellRefresh",// 单元格刷新，写入到顶层的 raft
]);