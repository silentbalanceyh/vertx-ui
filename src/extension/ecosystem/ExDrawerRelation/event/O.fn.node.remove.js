import Ux from "ux";
import Ex from 'ex';

export default (reference, config = {}, hide) => (event) => {
    const {item} = config;
    const model = item.getModel();
    if (model.data && model.data['identifier']) {
        const {identifier} = model.data;
        const {$dropped} = reference.state;
        const droppedSet = new Set($dropped);
        droppedSet.delete(identifier);
        /* 删除合并 */
        let $replaced = Array.from(droppedSet);
        $replaced = Ux.clone($replaced);
        reference.setState({$dropped: $replaced});
        /* 隐藏 */
        hide(event);
        /* 移除节点 */
        Ex.g6ItemRemove(config.graph, model);
    }
}