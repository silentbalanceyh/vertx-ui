import Ux from "ux";
import U from 'underscore';

export default (reference, config = {}) => {
    const columns = Ux.configColumn(reference, config.table.columns);
    const rowSelection = {
        type: 'radio',
        onSelect: keys => {
            // 保证原始的key存在
            const applyKey = (item) => {
                if (item.key) item._key = item.key;
            };
            if (U.isArray(keys)) {
                keys.forEach(item => applyKey(item));
            } else if (U.isObject(keys)) {
                applyKey(keys);
            }
            reference.setState({$select: keys});
        }
    };
    return {columns, rowSelection}
};