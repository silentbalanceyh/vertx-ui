import Ux from 'ux';
import Cv from "../O.fn.constant";
import Fn from '../../../functions';

export default (params) => {
    const user = Ux.isLogged();
    const companyCode = user['companyCode'];
    return Ux.ajaxGet("/DataAsset/data-source/tree/:companyCode/all", {
        companyCode,
    }, Cv.OPTIONS).then(response => {
        const normalized = [];
        response.forEach(each => {
            const menu = {};
            menu.key = each.id;
            menu.text = each.name;
            menu.data = Ux.clone(each);
            menu.type = Fn.Cv.Types.DataSource;
            normalized.push(menu);
            // 子菜单处理
            if (Ux.isArray(each.children)) {
                each.children.forEach(child => {
                    // 子节点
                    const menuitem = {};
                    menuitem.key = child.id;
                    menuitem.text = child.name;
                    menuitem.parentId = menu.key;
                    menuitem.type = Fn.Cv.Types.DataTable;
                    const $child = Ux.clone(child);
                    // 数据源名称
                    $child.dataSource = each.name;
                    menuitem.data = $child;
                    normalized.push(menuitem);
                });
            }
        })
        return Ux.promise(normalized);
    });
}