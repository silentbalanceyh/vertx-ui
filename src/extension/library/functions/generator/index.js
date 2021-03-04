import boolean from './gen.runtime';
import status from './gen.runtime.status';

import batch from './gen.rx.batch';
import column from './gen.rx.column';
import tab from './gen.rx.tab';
import search from './gen.rx.search';
import row from './gen.rx.row';
import file from './gen.rx.file';

export default {
    ...tab,
    ...search,
    ...row,
    ...boolean,
    ...status,
    ...batch,
    ...column,
    ...file,
}
/*
 * 函数基础规范
 * 1）从组件最外层传入的函数（无关组件的使用 fn，相关的还是要使用 rx）：
 * -- 1.1. fn 开头，Function 缩写
 * ---- fnApp（读取应用程序数据）
 * ---- fnOut（Redux写入树）
 * 2）组件内部从上层往下继承的函数
 * 为了兼容原生态的 Ux 使得输入统一，外层函数全部遵循
 * -- 2.1. rx 开头，Runtime Executor缩写
 * ---- (1) 这种函数直接调用 Ex.rx(reference).<name> 执行注入
 * ---- (2) 调用父类传入：const fun = Ex.rx(reference).do<Name>()
 * -- 2.2. 状态函数比较特殊主要包括，Runtime State缩写
 * ---- (1) 绑定：const fun = Ex.rs(reference).<name> / 这种直接调用 fun()
 * ---- (2) 调用父类传入：const fun = Ex.rs(reference).do<Name>()
 * ---- (3) 暂时开放的状态函数：
 * -------- $visible
 * -------- $submitting
 * -------- $loading
 */