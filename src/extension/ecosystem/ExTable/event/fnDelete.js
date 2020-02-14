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
    /*
     * 上层 $dirtyAsync
     */
    Ex.rsLoading(reference)({});
    /* 删除数据 */
    Ex.rx(reference).delete(id, () => {
        /* $dirty 标记处理 */
        Ex.rx(reference).dirty();
    });
}