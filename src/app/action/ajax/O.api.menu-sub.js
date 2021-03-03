import Ux from 'ux';
import Cv from "./O.fn.constant";

const mountData = (menuItem = {}) => {
    const item = {};
    item.key = menuItem.code;
    item.sort = menuItem.order;
    item.text = menuItem.name;
    item.uri = menuItem.url;
    if (menuItem.icon) item.icon = menuItem.icon;
    item.data = Ux.clone(menuItem);
    return item;
}

export default (params) => {
    // TODO: API-Menu 主菜单读取
    const user = Ux.isLogged();
    if (!Ux.isEmpty(user)) {
        const username = user.email;
        const appCode = params.key;
        return Ux.ajaxPost("/Login/user/get-menu-list", {
            username,
            appCode
        }, Cv.OPTIONS).then((response = {}) => {
            // 主菜单构造
            const normalized = [];
            const {menu = []} = response;
            menu.forEach(menuItem => {
                const item = mountData(menuItem);
                normalized.push(item);
                if (menuItem.hasOwnProperty('childMenus')) {
                    menuItem.childMenus.forEach(sub => {
                        const subitem = mountData(sub);
                        subitem.parentId = item.key;
                        normalized.push(subitem);
                    });
                }
            })
            return Ux.promise(normalized);
        })
    } else return Ux.promise([]);

}