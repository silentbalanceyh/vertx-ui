import Ex from 'ex';
import Ux from 'ux';
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
    const ref = Ux.onReference(reference, 1);
    if (ref) {
        ref.setState({$dirtyAsync: true});
    }
    /* 删除数据 */
    Ex.rx(reference).delete(id);
}