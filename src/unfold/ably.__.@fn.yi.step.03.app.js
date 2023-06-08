import Ux from 'ux';
import __Zn from './zero.module.dependency';
import {_Locator} from "./allocation.__.c.locator.navigation";
import __Rv from './allocation.__.fn.resolve.navigation';
/*
 * React issue warning:
 * https://github.com/ant-design/pro-components/issues/6534
 * This issue does not impact the usage when you set `itemClick`.
 */
const __rxAppClick = (reference) => (props = {}) => {
    const {data = {}} = props;
    if (data.uri) {
        /*
         * Here the system should record the navigated menu ( App Menu )
         * For the other menu filter
         * When you clicked `ENTRY_MENU`, the system should go to the left Part
         * -- undefined: navigate to the `Desktop` menu.
         * -- menuId: navigate to the correct menu ( Build the menu tree ).
         */
        const locator = _Locator.create(reference);
        locator.goApp(data);
        // .then(item => Ux.toRoute(reference, item.uri));
    }
}
export default async (reference, menuData = [], config = {}) => {
    if (__Rv.resolvePwd(reference)) {
        return {}
    } else {
        // data process for ExLogged;
        const appData = __Zn.a4MenuPick(menuData, Ux.Env.MENU_TYPE.BAG)
            .filter(item => item.hasOwnProperty('bag'));
        const appList = [];
        appData.forEach(item => {
            const app = {};
            const {bag = {}} = item;
            app.title = item.text;
            app.desc = bag['nameFull'];
            app.icon = item.icon;
            app.data = Ux.clone(item);
            appList.push(app);
        });
        return {
            appList,
            onItemClick: __rxAppClick(reference),
        };
    }
}