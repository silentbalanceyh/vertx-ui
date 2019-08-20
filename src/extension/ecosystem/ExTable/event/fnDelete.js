import Ex from 'ex';
/*
 * 行删除功能，绑定到 fnDelete 中
 * id: 当前行的ID
 * record：当前行的记录
 * metadata:
 * {
 *      config: 当前传入配置,
 *      reference：当前传入引用
 * }
 */
export default (id, record, metadata = {}) => {
    const {reference} = metadata;
    /* 行删除专用 */
    Ex.rsLoading(reference)({$dirty: true});
    /* 删除数据 */
    Ex.rx(reference).delete(id)
    /* 删除时不调用上层数据 */
    // .then(result => Ex.rx(reference).dirty(result));
}