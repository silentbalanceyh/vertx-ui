import __Zn from './zero.module.dependency';
import {DataArray} from 'zme';

const dslArray = (reference, key, data = [], config = {}) => {
    const {field = "key", remove = false} = config;
    /* 转换成 DataArray */
    let dataArray = reference.state ? reference.state[key] : [];
    let $dataArray;
    if (__Zn.isArray(dataArray)) {
        $dataArray = new DataArray(dataArray);
    } else {
        $dataArray = dataArray;
    }
    /* 转换成 Array */
    let normalized = [];
    if (__Zn.isObject(data)) {
        normalized = [data];
    } else {
        normalized = normalized.concat(data);
    }
    /* 合并处理 */
    normalized.forEach(data => {
        if (remove) {
            $dataArray.removeElement(data[field], field);
        } else {
            $dataArray.saveElement(data, field);
        }
    });
    return $dataArray.to();
}
export default {
    dslArray
}