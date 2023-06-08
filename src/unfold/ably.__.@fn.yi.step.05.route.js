import Ux from "ux";
import __Zn from './zero.module.dependency';

export default async (reference, menuData = []) => {
    // name
    const normalized = __Zn.a4MenuPick(menuData, Ux.Env.MENUS.MODULE);
    /*
     * 路由专用构造（用于构造树形结构路由）
     */
    const treeData = Ux.toTree(normalized, {sort: 'order'});
    treeData.forEach(root => root.routes = root.children)
    Ux.itTree(treeData, item => {
        item.name = item.title;
    });
    return Ux.elementMap(treeData, 'key');
}