import Ajx from '../../ajax';
import Ux from 'ux';

/**
 *
 * ## 扩展函数
 *
 * 1. 直接读取 resource.tree 中的内容
 * 2. 遇到 ID:XXX 需要执行判断，进行深度树的二次读取
 * 3. 最终构造完成的树形数组（parentId一致）
 */
const authTreeRes = (state = {}) => {
    /* resource.tree */
    return Ajx.category({type: "resource.tree"}).then(categories => {
        /*
        * 资源基本信息
        * - 处理资源分类表
        * 1）以 resource 开头作为基本分类数据
        * 2）分类之下的子数据作为 identifier 的过滤信息
        * */
        const treeData = Ux.clone(categories);
        const children = [];        // 子节点 promise
        categories.filter(category => "ID:X_CATEGORY" === category.identifier).forEach(category => {
            /*
             * 查询子节点
             */
            children.push(Ajx.category({type: category.code})
                .then(childData => {
                    childData.filter(child => !child.parentId)
                        .forEach(item => item.parentId = category.parentId)
                    return Ux.promise(childData);
                })
            );
        });
        return Ux.parallel(children).then((matrix = []) => {
            matrix.forEach(eachArray => eachArray.forEach(item => treeData.push(item)));
            /*
             * $treeData: 原始数组
             * $tree：构造过后的树
             */
            const $treeData = treeData
                // 去掉已经替换的节点信息
                .filter(category => "ID:X_CATEGORY" !== category.identifier)
            state.$treeData = $treeData;
            state.$tree = Ux.toTree($treeData, {
                title: "name"
            });
            return Ux.promise(state);
        });
    })
}
export default {
    authTreeRes,
}