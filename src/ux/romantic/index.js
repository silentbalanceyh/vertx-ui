import sexCab from './O.fn.cab';
import sexModal from './O.fn.modal';
import sexTable from './O.fn.table';
import sexBatch from './O.fn.batch';

import sexDialog from './O.fn.dialog';
import sexMessage from './O.fn.message';
import sexIdentifier from './O.fn.identifier';
import sexOp from './O.fn.op';

export default {
    /*
     * 读取配置骚操作
     * 1. key = string，直接调 Ux.fromHoc(reference, key)
     * 2. key = Array 或 key包含了 . 数据，直接调 Ux.fromPath(reference, key)
     * 3. key = object, 直接返回 key
     * 4. key = undefined，不传，返回 props 的 config
     */
    sexCab,// (reference, key)
    sexOp,
    /*
     * {
     *     "dialog": "",
     *     "button": ""
     * }
     */
    sexModal,
    sexIdentifier,
    sexTable,
    sexDialog,  /* 窗口 */

    sexBatch,
    sexMessage,
}