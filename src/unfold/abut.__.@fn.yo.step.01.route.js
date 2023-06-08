import {_Locator} from "./allocation.__.c.locator.navigation";
import Ux from 'ux';

export default (reference) => {
    const setting = {};
    const route = {};

    const locator = _Locator.create(reference);
    route.routes = locator.yoRoutes();
    // Fix: 保证自动计算可控（如果不设置则菜单不显示）
    setting.location = Ux.Env.K_VALUE.SLASH;
    setting.route = route;
    return setting;
}