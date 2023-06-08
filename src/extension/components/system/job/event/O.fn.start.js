import Ux from 'ux';
import Ex from 'ex';
import Ui from './O.tabs';

export default (reference, record) => (event) => {
    Ux.prevent(event);
    /*
     * 先改变状态导致按钮不可用
     */
    Ui.onTask(reference, record, "RUNNING");
    /*
     * 操作 key
     */
    const key = record.opKey;
    Ex.I.jobStart(key);
}