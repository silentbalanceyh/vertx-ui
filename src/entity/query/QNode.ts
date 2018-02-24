/**
 *
 * 查询节点接口，主要分为子节点和分支节点
 * @interface QNode
 */
interface QNode {
    // 转换成Query查询节点
    to(): Object;
    // 判断当前节点
    is(): boolean;
}

export default QNode;
