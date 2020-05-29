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
    /* Designer 系列 */
    "rxRowAdd",     // 添加行
    "rxRowDel",     // 删除行
    "rxCellMerge",  // 合并单元格
    "rxCellDel",    // 删除单元格
    "rxCellSplit",  // 拆分单元格
]);