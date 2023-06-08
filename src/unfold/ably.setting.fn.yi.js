import Ux from 'ux';
import __Zn from './zero.module.dependency';
import __yiSetting from './ably.__.@fn.yi.step.00.setting';
import __yiAvator from './ably.__.@fn.yi.step.01.avator';
import __yiExtra from './ably.__.@fn.yi.step.02.extra';
import __yiApp from './ably.__.@fn.yi.step.03.app';
import __yiLogo from './ably.__.@fn.yi.step.04.logo';
import __yiRoute from './ably.__.@fn.yi.step.05.route';
import {_Locator} from "./allocation.__.c.locator.navigation";

/**
 * ## 「通道」`Ux.yiProSetting`
 *
 * @memberOf module:yi/unfold
 * @param reference
 * @return {Promise<*>}
 */
const yiProSetting = async (reference) => {
    // 旧代码
    const {$collapsed = true} = reference.props;
    const state = {};
    state.$collapsed = $collapsed;

    // 菜单初始化
    const menuSource = Ux.ambWide(reference, "menus");
    /*
     * {
     *     bag: {
     *         ... BAG数据
     *     }
     * }
     */
    const menuData = __Zn.a4MenuData(menuSource);
    state.$menuData = menuData;
    /*
     * 构造 settings
     * __mySetting 可直接根据 MY_SETTING 读取核心配置（已存储的），然后执行配置处理
     * 后续根据存储配置执行相关操作，拷贝基础数据作为后续读取执行配置
     */
    const $setting = await __yiSetting(reference, menuData);
    const configuration = Ux.clone($setting);

    /*
     * Step 01
     * -- 右上角登录后图标设置（默认是已经处理过的图标设置）
     * avatorProps
     */
    $setting.avatarProps = await __yiAvator(reference, menuData, configuration);

    /*
     * Step 02
     * -- 右上角登录图标旁边菜单：Extra
     * actionsRender
     */
    $setting.actionsRender = await __yiExtra(reference, menuData, configuration);

    /*
     * Step 03
     * -- 左上角应用列表（包括设置 itemClick 处理应用导航）
     * appList
     * itemClick
     */
    const appConfig = await __yiApp(reference, menuData, configuration);
    Object.assign($setting, appConfig);

    /*
     * Step 04
     * -- 头部链接点击
     */
    $setting.headerTitleRender = await __yiLogo(reference, menuData, configuration);

    /*
     * Step 05
     * -- 构造菜单路由表，用于构造菜单专用数据集
     * $route = {};
     * 路由构造中，仅读取 SIDE-MENU / BAG-MENU
     */
    // const routes = await __yiRoute(reference, menuData);
    state.$route = await __yiRoute(reference, menuData);
    /*
     * Step 06
     * -- 构造选中菜单项
     */
    const locator = _Locator.create(reference);
    const stateOpen = locator.yiOpen(menuData);
    Object.assign(state, stateOpen);
    // const locator = _Locator.create(reference);
    // await locator.yiStore(menuData, routes);
    // state.$bag = await locator.yiBag(menuData);
    // 最终处理成 $setting 设置集
    state.$setting = $setting;
    state.$settingDefault = $setting;
    return state;
}
export default {
    yiProSetting,
}