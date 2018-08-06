const sortString = (left = "", right = "", asc = true) => {
    const minLen = Math.min(left.length, right.length);
    let order = 0;
    for (let idx = 0; idx < minLen; idx++) {
        const leftCode = left.charCodeAt(idx);
        const rightCode = right.charCodeAt(idx);
        if (leftCode !== rightCode) {
            if (asc) {
                order = leftCode - rightCode;
            } else {
                order = rightCode - leftCode;
            }
            break;
        }
    }
    return order;
};
/**
 * @class Sorter
 * @description Table组件排序专用函数，对应列中的sorter
 */
export default {
    /**
     * 顺序排序
     * @method sorterAsc
     * @param left 左值
     * @param right 右值
     * @param key 排序的值，这种情况针对对象数组
     * @return {number|*}
     */
    sorterAsc: (left, right, key) => key ? sortString(left[key], right[key]) : sortString(left, right),
    /**
     * 逆序排序
     * @method sorterDesc
     * @param left 左值
     * @param right 右值
     * @param key 排序的字段，这种清空针对对象数组
     * @return {number|*}
     */
    sorterDesc: (left, right, key) => key ? sortString(left[key], right[key], false) : sortString(left, right, false),
}
