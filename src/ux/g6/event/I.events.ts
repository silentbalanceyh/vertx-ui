import {Abs} from '../internal';
/*
 * 构造魔幻调用，vertx-ui 使用的是 rx 前缀
 * 这里的函数直接使用 gx 前缀
 *
 * 关于函数命名：
 * 1. 名动词结构
 * 名词 + 动词 + 标记位
 * 名词：
 * -- Node：节点
 * -- Edge：边
 * -- Canvas：画布
 * -- Group：组
 * 2. 标记位包括
 * --
 *
 */
const generateFn = (gEvent, name) => {
    return (item) => {
        // executor 提取
        let executor;
        const reference = gEvent.reference();
        if (reference) {
            if (reference.state) {
                executor = reference.state[name];
            }
            if (!Abs.isFunction(executor)) {
                executor = reference.props[name];
            }
            if (Abs.isFunction(executor)) {
                // 第二参为 gEvent 引用
                return executor(item, gEvent);
            } else return item;
        } else {
            throw new Error("对不起，该方法不支持 reference 引用为空的调用，引用缺失！");
        }
    }
}

const gx = (gEvent) => ({
    /*
     * 节点执行流程
     * 1）数据本身 ->
     * 2）执行 onNodeInitBefore ->
     * 3）构造节点信息（g6格式）->
     * 4）根据不同需要计算 shape 类型，当前系统中是 node-ci 在使用
     * -- 这个值可以根据 stencil 中的配置数据来
     */
    onNodeInitBefore: generateFn(gEvent, 'onNodeInitBefore'),
    onNodeInitAfter: generateFn(gEvent, 'onNodeInitAfter'),
});
export default {
    gx,
};