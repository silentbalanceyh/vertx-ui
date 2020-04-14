import Event from "./O.common";
import Ux from "ux";
import {Modal} from "antd";

const onProbe = (reference, data = {}) => {
    const existing = Event.ciExisting(reference, data);
    if (existing) {
        const modal = Ux.fromHoc(reference, "modal");
        modal.content = Ux.formatExpr(modal.content, data, true);
        Modal.confirm({
            ...modal,
            onOk: () => {
                const state = Event.ciMoveData(reference, data);
                reference.setState(state);
            }
        })
    } else {
        const state = Event.ciOpen(reference, data);
        reference.setState(state);
    }
};
export default {
    /*
     * onProbe 中的 data 的特别的数据结构：
     * {
     *      "globalId": "必须数据，UCMDB ID"，
     *      "name": "当前数据中的 name 节点",
     *      "identifier": "标识符相关信息"
     * }
     */
    onProbe,
    onVisit: (reference) => (dataEvent) => {
        const model = dataEvent.getPrev();
        const {$identifier} = reference.props;
        if ($identifier) {
            const data = Ux.clone(model);
            data.identifier = $identifier;
            onProbe(reference, data);
        }
    },
    onSelected: (reference, item = {}) => (event) => {
        Ux.prevent(event);
        const state = Event.ciMove(reference, item);
        reference.setState(state);
    },
    onStart: Event.ciStart,
}