import Ex from "ex";
import Ux from 'ux';
import Opt from '../options';
import yoBatchEditor from './yo.batch.editor';

const {Order = {}} = Opt;

export default (reference) => {
    let batch = Ex.yoAction(reference, 'op.batch', Order);
    /*
     * batch是数组，则处理 disabled 状态
     */
    const {$selected = [], $submitting = false} = Ex.state(reference);
    /*
     * Disabled-001：初始化
     */
    if (batch.config) {
        batch.config.map(each => each.disabled = 0 === $selected.length);
    }
    batch.$category = "LINK";
    batch.doSubmitting = Ex.rxSubmitting(reference);
    /*
     * ExBatchEditor 列专用处理
     */
    batch = yoBatchEditor(batch, reference);
    /*
     * ExBatchEditor 中需要的外层函数
     */
    batch.rxBatchEdit = Ex.rxBatchEdit(reference);
    /*
     * 选中项
     */
    batch.$selected = Ux.clone($selected);
    batch.$submitting = $submitting;
    return batch;
}