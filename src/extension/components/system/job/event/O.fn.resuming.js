import Ux from "ux";
import Ui from "./O.tabs";
import Ex from "ex";

export default (reference, record) => (event) => {
    Ux.prevent(event);
    /*
     * 先改变状态导致按钮不可用
     */
    Ui.onTask(reference, record, "READY");
    /*
     * 操作 key
     */
    const key = record.opKey;
    Ex.I.jobResume(key);
}