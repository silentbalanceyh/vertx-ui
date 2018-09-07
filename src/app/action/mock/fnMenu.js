import fnMenuData from './fnMenuData'
import Ux from 'ux';

const menus = [];
const dataArray = fnMenuData ? fnMenuData : [];
dataArray.forEach(each => {
    const item = each.split(',');
    const app = Ux.isInit();
    const menu = {};
    // 主键，AppId，激活状态
    menu.key = Ux.randomUUID();
    menu.appId = app.key;
    menu.active = true;
    // 文字，图标，名称
    menu.text = item[0];
    menu.icon = item[1];
    menu.name = item[2];
    // URI
    if ("EXPAND" === item[3]) {
        menu.tscript = item[3];
    } else {
        menu.uri = item[3];
    }
    menu.left = Ux.valueInt(item[4]);
    // 父节点处理
    menu.parentId = item[5] ? item[5] : undefined;
    if (!menu.parentId) {
        delete menu.parentId;
        menu.level = 1;
    }
    menus.push(menu);
});
const findArray = (name) => {
    const $dataArray = Ux.clone(menus);
    const unique = $dataArray.filter(item => name === item.name);
    return unique[0];
};
menus.forEach(dataItem => {
    if (dataItem.parentId) {
        const parent = findArray(dataItem.parentId);
        dataItem.parentId = parent.key;
        dataItem.level = parent.level + 1;
    }
});
// 处理pid
export default {
    mock: true,
    data: menus
}