import Ux from "ux";
import U from 'underscore';

export default (reference, config = {}) => {
    const ref = Ux.onReference(reference, 1);
    const {table = {}} = config;
    const columns = Ux.configColumn(ref, table.columns ? table.columns : []);
    const rowSelection = {
        type: 'radio',
        onSelect: keys => {
            // 保证原始的key存在
            const applyKey = (item) => {
                if (item.key) item._key = item.key;
            };

            // 根据数据类型选择
            if (U.isArray(keys)) {
                keys.forEach(item => applyKey(item));
            } else if (U.isObject(keys)) {
                applyKey(keys);
            }
            reference.setState({$keySet: keys});
        }
    };
    return {columns, rowSelection}
};