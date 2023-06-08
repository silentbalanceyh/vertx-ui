import Ux from "ux";
// 跳级处理
import {_I} from 'zet'

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
                append.checkable = false;
            }
            Object.assign(item, append);
        });
        normalized = normalized.concat(treeArray);
    }
    return Ux.toTree(normalized, {title: 'text'});
}
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
        state.$treeData = groups;

        return Ux.promise(state);
    })
}
const authTreeRes = (state = {}) => {
    /* resource.tree */
    return _I.forest("resource.tree").then(response => {
        state.$treeData = response;
        state.$tree = Ux.toTree(response, {
            title: "name"
        });
        return Ux.promise(state);
    })
}
export default {
    authGroups,
    authTreeRes,
}