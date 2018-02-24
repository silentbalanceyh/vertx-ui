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
export default {
    sorterAsc : (left, right) => sortString(left, right),
    sorterDesc : (left, right) => sortString(left, right, false)
}
