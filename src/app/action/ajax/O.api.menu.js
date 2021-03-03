import Ux from 'ux';
import Cv from "./O.fn.constant";

const MOCK = {
    DataAnalysis: {
        icon: "data-analyze",
        uri: "/main/index",
    },
    DataAsset: {
        icon: "data-assert",
        uri: "/main/index"
    },
    DataMarket: {
        icon: "data-market",
        uri: "/main/index"
    },
    Persona: {
        icon: "data-photo",
        uri: "/main/index",
    },
    REPORT: {
        icon: "data-report",
        uri: "/main/index",
    },
    SystemAdmin: {
        icon: "data-setting",
        uri: "/main/index",
    }
}

export default () => {
    // API-Menu 主菜单读取
    const user = Ux.isLogged();
    if (!Ux.isEmpty(user)) {
        const username = user.email;
        const $menus = Ux.Session.get("APP-MENU");
        if ($menus) {
            return Ux.promise($menus);
        } else {
            return Ux.ajaxPost("/Login/user/get-app-list", {
                username
            }, Cv.OPTIONS).then((response = {}) => {
                const menus = [];
                const {app = []} = response;
                app.forEach(item => {
                    const menu = {};
                    menu.text = item.appName;
                    menu.key = item['appCode'];
                    menu.description = item['appDesc'];
                    const attach = MOCK[menu.key];
                    if (attach) {
                        Object.assign(menu, attach);
                    }
                    menus.push(menu);
                })
                Ux.Session.put("APP-MENU", menus);
                return Ux.promise(menus);
            });
        }
    } else return Ux.promise([]);
}