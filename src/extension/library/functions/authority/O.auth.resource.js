import Ux from 'ux';
// 跳级处理
import Ajx from '../../ajax';

const treeSlash = (permissions = [], type = {}) => {
    /*
     * name = x/y/z
     * 转换成树 x - y - z
     */
    let normalized = [];

    const unslashed = permissions.filter(each => 0 > each.name.indexOf('/'));
    if (0 < unslashed.length) {
        const grouped = Ux.elementGroup(unslashed, "name");
        Object.keys(grouped).forEach(name => {
            const dataItem = {};
            dataItem.key = Ux.encryptMD5(name);

            const dataPart = grouped[name];
            const counter = dataPart.length;
            dataItem.text = `${name} （${counter}）`;
            dataItem.dataType = type.key;
            dataItem.dataCode = dataPart.map(item => item.code);
            dataItem.dataName = name;
            dataItem.name = name;
            normalized.push(dataItem);
        })
    }

    const slashed = permissions.filter(each => 0 <= each.name.indexOf('/'));
    if (0 < slashed.length) {
        /*
         * 先执行 compress 压缩
         */
        const grouped = Ux.elementGroup(slashed, "name");
        /*
         * 补充、扩展、排序
         */
        const treeArray = Ux.toTreeTextArray(Object.keys(grouped));
        /*
         * 填充数据信息
         */
        treeArray.forEach(item => {
            const data = grouped[item.dataKey];
            const counter = data ? data.length : 0;
            const append = {};
            if (data && 0 < data.length) {
                /*
                 * 追加数据节点
                 */
                append.dataType = type.key;
                append.dataCode = data.map(item => item.code);
                append.dataName = item.dataKey;
                append.text = `${item.name} （${counter}）`;
            } else {
                /*
                 * append.selectable = false
                 */
                append.text = item.name;
                append.selectable = false;
            }
            Object.assign(item, append);
        });
        normalized = normalized.concat(treeArray);
    }
    return Ux.toTree(normalized, {title: 'text'});
}
/**
 * ## 扩展函数
 *
 * 1. 根据传入的 treeData 提取 resource.tree 构造分类
 * 2. 读取远程的权限组，权限组挂在分类下边
 */
const authGroups = (state = {}, types = []) => {
    /* 权限组读取 */
    return Ux.ajaxGet("/api/permission/groups/by/sigma", {}).then(groups => {
        /*
         * 新版直接走 S_PERM_SET 的树形结构
         * 一级：module
         * 二级：name，带权限数量处理
         */
        const groupType = Ux.elementGroup(groups, "type");
        /*
         * 一级树处理
         */
        const treeData = [];
        types.forEach(type => {
            /*
             * 一级构造
             */
            const treeItem = {};
            treeItem.key = type.key;
            treeItem.title = type.name;
            const permissions = groupType[type.key];
            if (Ux.isArray(permissions)) {
                /*
                 * 构造二级以下的树结构
                 */
                treeItem.children = treeSlash(permissions, type);
            }
            treeData.push(treeItem);
        })
        state.$tree = treeData.sort(Ux.sorterAscFn("title"));     // 左树处理

        return Ux.promise(state);
    })
}
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
    return Ajx.forest("resource.tree").then(response => {
        state.$treeData = response;
        state.$tree = Ux.toTree(response, {
            title: "name"
        });
        return Ux.promise(state);
    })
}
export default {
    authTreeRes,
    authGroups,
}