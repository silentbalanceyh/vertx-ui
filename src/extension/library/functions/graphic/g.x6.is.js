import Ux from 'ux';
/*
 * 判断自我关系的合法性
 * 1）如果是自引用只可当前节点
 * 2）其他节点不可创建自引用
 */
const isLoopOk = (edge, managed = {}) => {
    const [source, target] = Ux.x6FromTo(edge, 'identifier')
    if (source === target) {
        return (source !== managed.identifier)
    } else return false;
}
/*
 * 其他节点不可创建关系
 */
const isUnmanaged = (edge, managed = {}) => {
    const [source, target] = Ux.x6FromTo(edge, 'identifier');
    const identifier = managed.identifier;
    return (source !== identifier && target !== identifier);
}
export default {
    isLoopOk,
    isUnmanaged,
}