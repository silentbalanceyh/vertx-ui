import Ux from 'ux';
import Mock from "./mock";

export default {
    // 读取当前应用程序
    "app": {
        ajax: () => Ux.ajaxFetch("/apps/:name", {name: Ux['Env']['APP']}, Mock.fnApp),
        processor: data => ({app: Ux.storeApp(data)})
    },
    "app.menus": {
        ajax: () => Ux.ajaxGet("/api/menus/:appId", {appId: Ux['Env']['APP']}, Mock.fnMenu),
        processor: data => ({"datum.menus": data})
    }
}