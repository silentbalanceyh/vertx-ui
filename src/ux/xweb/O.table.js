import Abs from '../abyss';
import Cmn from './O.common';
import Ux from "ux";

const xtRowAdd = (reference, record, index) => (event) => {
    Abs.prevent(event);
    const data = Cmn.xtGet(reference);
    if (Abs.isArray(data)) {
        /* 在当前索引之下插入 */
        data.splice(index + 1, 0, {key: Ux.randomUUID()});
        reference.setState({data});
    }
}
const xtRowDel = (reference, record, index) => (event) => {
    Ux.prevent(event);
    let data = Ux.xtGet(reference);
    if (Ux.isArray(data)) {
        /* 直接移除当前索引位置的数据 */
        let merged = [];
        if (1 === data.length) {
            const item = {};
            item.key = data[0].key;
            if (!item.key) {
                item.key = Ux.randomUUID();
            }
            merged = [item];
        } else {
            data = data.filter((item, itemIdx) => !(record.key === item.key && itemIdx === index));
            merged = data;
        }
        reference.setState({data: merged});
        return Abs.promise(merged);
    } else {
        return Abs.promise(null);
    }
}
export default {
    xtRowAdd,
    xtRowDel
}