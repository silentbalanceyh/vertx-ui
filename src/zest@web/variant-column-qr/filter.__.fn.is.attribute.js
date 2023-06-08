import __Zn from "./zero.uca.dependency";

export default {
    // 是否存在过滤值
    isFiltered: (reference, config = {}) => {
        const {
            $condition = {}
        } = reference.state ? reference.state : {};
        let filtered = false;
        const {
            field
        } = config;
        if ($condition.hasOwnProperty(field)) {
            const value = $condition[field];
            if (__Zn.isArray(value)) {
                filtered = (0 < value.length);
            }
        }
        return filtered;
    }
}