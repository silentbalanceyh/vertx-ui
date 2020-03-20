import Ex from 'ex';
import Is from './O.common';

export default (reference) => (input = {}) => {
    const {source, target, graph} = input;
    const sourceData = Ex.g6NodeData(source);
    const targetData = Ex.g6NodeData(target);
    if (Is.anchorValidate({sourceData, targetData}, reference, graph)) {
        /* 不显示锚点信息，证明不可连接，如果强制连接会出现相关信息 */
        graph.setItemState(target, "addingEdge", false);
        graph.setItemState(target, "limitLink", false);
    }
}