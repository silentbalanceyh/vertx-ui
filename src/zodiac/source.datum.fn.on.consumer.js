import {DataArray} from 'zme';
import __Zn from './zero.module.dependency';

const __parseDatum = (target, key) => {
    if (target) {
        const targetKey = target[`$t_${key}`] || target[`$a_${key}`];
        if (targetKey) {
            if (targetKey.is()) {
                return targetKey;
            } else {
                return targetKey;
            }
        }
    }
}
const __fromDatum = (reference, key) => {
    key = key.replace(/\./g, "_");
    // props 提取
    let parsed;
    if (reference.props) {
        parsed = __parseDatum(reference.props, key);
    }
    if (!parsed) {
        parsed = __parseDatum(reference.state, key);
    }
    return parsed ? parsed : new DataArray(undefined);
}
const onDatum = (reference, key) => {
    if (key && "string" === typeof key) {
        const data = __fromDatum(reference, key);
        const dataArray = (data && data.is()) ? data.to() : [];
        return __Zn.isArray(dataArray) ? dataArray : [];
    } else {
        console.warn("[ Ux ] 传入的 `key` 值不对", key);
        return [];
    }
};
const onSave = (reference, key, data, isDeleted = false) => {
    if (key) {
        const dataArray = onDatum(reference, key);
        if (dataArray) {
            const $data = new DataArray(dataArray);
            if (__Zn.isArray(data)) {
                // Array 格式保存
                data.forEach(record => {
                    if (isDeleted) {
                        $data.removeElement(record.key);
                    } else {
                        $data.saveElement(record);
                    }
                })
            } else {
                if (isDeleted) {
                    $data.removeElement(data.key);
                } else {
                    $data.saveElement(data);
                }
            }
            return $data.to();
        }
    }
};
export default {
    // Read
    onDatum,
    // Write
    onSave,
}

