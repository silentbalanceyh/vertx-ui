/*
 * op.extension 部分的执行
 */
export default (reference, prefix) => {
    const {op = {}} = reference.state;
    const extension = Object.keys(op)
        .filter(key => key.startsWith("op.extension"))
        .filter(key => !!op[key])
        .filter(key => !!op[key].region)
        .filter(key => op[key].region.startsWith(prefix))
        .map(key => {
            const normalized = op[key];
            normalized.key = op[key].region;
            return normalized;
        });
    if (1 === extension.length) {
        return extension;
    } else {
        return extension.sort((left, right) => left.index - right.index);
    }
}