import __Zn from './zero.module.dependency';
import __OP from './uca.fn.xt.op.primary';

const xtRowChange = (reference, rowKey, field) => (event) => {
    let {value = []} = reference.props;
    if (__Zn.isArray(value) && rowKey && field) {
        value = __Zn.clone(value);
        const fieldValue = __Zn.ambEvent(event);
        value.forEach(each => {
            if (rowKey === each.key) {
                each[field] = fieldValue;
            }
        });
        __Zn.fn(reference).onChange(value);
    }
}
const xtRowAdd = (reference, record, index) => (event) => {
    __Zn.prevent(event);
    const data = __OP.xtGet(reference);
    if (__Zn.isArray(data)) {
        /* 在当前索引之下插入 */
        data.splice(index + 1, 0, {key: __Zn.randomUUID()});
        
        // reference.?etState({data});
        __Zn.of(reference).in({data}).done();
    }
}

const xtRowDel = (reference, record, index) => (event) => {
    __Zn.prevent(event);
    let data = __OP.xtGet(reference);
    if (__Zn.isArray(data)) {
        /* 直接移除当前索引位置的数据 */
        let merged = [];
        if (1 === data.length) {
            const item = {};
            item.key = data[0].key;
            if (!item.key) {
                item.key = __Zn.randomUUID();
            }
            merged = [item];
        } else {
            data = data.filter((item, itemIdx) => !(record.key === item.key && itemIdx === index));
            merged = data;
        }
        __Zn.of(reference).in({data: merged}).done();
        // reference.?etState({data: merged});
        return __Zn.promise(merged);
    } else {
        return __Zn.promise(null);
    }
}

export default {
    xtRowAdd,
    xtRowDel,
    xtRowChange,
}