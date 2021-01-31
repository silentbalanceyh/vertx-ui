import Ux from 'ux';
import yoBatchEditor from './yo.batch.editor';
import yoExtension from "./yo.extension";
import yoAction from '../yo.action';
/*
 * Order 内置
 * Ex 转换成 functions 函数
 */
import {Fn, Order} from './I.list.options';

export default (reference) => {
    let batch = yoAction(reference, 'op.batch', Order);
    /*
     * batch是数组，则处理 disabled 状态
     */
    const {$selected = [], $submitting = false} = reference.state;
    batch.$category = "LINK";
    batch.doSubmitting = Fn.rxSubmitting(reference);
    batch.doDirty = Fn.rxDirty(reference);
    /*
     * ExBatchEditor 列专用处理
     */
    batch = yoBatchEditor(batch, reference);
    /*
     * ExBatchEditor 中需要的外层函数
     */
    batch.rxBatchEdit = Fn.rxBatchEdit(reference);
    /*
     * 选中项
     */
    batch.$selected = Ux.clone($selected);
    batch.$submitting = $submitting;
    /*
     * 挂载 extension 部分
     */
    // const extension = yoExtension(reference, "op.batch", batch.config);
    // batch.config = [].concat(batch.config).concat(extension);
    batch.config = yoExtension(reference, "op.batch", batch.config);
    /*
     * Disabled-001：初始化
     */
    if (batch.config) {
        batch.config.map(each => each.disabled = 0 === $selected.length);
    }
    return Ux.sorterObject(batch);
}