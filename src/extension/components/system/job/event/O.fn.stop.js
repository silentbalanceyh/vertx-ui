import Ux from "ux";
import Ui from "./O.ui";
import Ex from "ex";

export default (reference, record) => (event) => {
    Ux.prevent(event);
    /*
     * 先改变状态导致按钮不可用
     */
    Ui.onTask(reference, record, "STOPPED");
    /*
     * 操作 key
     */
    const key = record.opKey;
    Ex.I.jobStop(key);
}