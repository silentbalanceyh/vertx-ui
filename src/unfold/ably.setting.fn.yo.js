import Ux from 'ux';
import Sk from 'skin';
/*
 * {
 *     title:
 * }
 */
import __yoSetting from './abut.__.@fn.yo.step.00.primary';
/*
 * {
 *     route:
 *     location
 * }
 */
import __yoRoute from './abut.__.@fn.yo.step.01.route';

import __yoModule from './abut.__.@fn.yo.step.02.module';

/**
 * ## 「通道」`Ex.yoProLayout`
 *
 * @memberOf module:yo/unfold
 * @param reference
 * @return {*}
 */
const yoProLayout = (reference) => {
    /*
     * title
     */
    const settings = __yoSetting(reference);

    /*
     * route
     * location
     */
    const settingRoute = __yoRoute(reference);

    /*
     * module by layout
     * - top
     * - side
     * - mix
     */
    const settingModule = __yoModule(reference, settings);
    Object.assign(settings, settingRoute, settingModule);
    Ux.dgDebug(settings, "路由设置信息");
    settings.token = Sk.skinDefaultToken(settings);
    return settings;
}
/**
 * ## 「通道」`Ex.yoProSettingDrawer`
 *
 * @memberOf module:yo/unfold
 * @param reference
 * @param containerId
 * @return {*}
 */
const yoProSettingDrawer = (reference, containerId) => {
    // 环境变量开合
    const isEnabled = Ux.Env["CSS_SKIN_TOOL"];
    if (!isEnabled) {
        return null;
    }
    const {
        $setting = {},
    } = reference.state;
    const attrDrawer = {};
    attrDrawer.settings = __yoSetting(reference);
    attrDrawer.enableDarkTheme = true;
    attrDrawer.getContainer = () => Ux.element(containerId);
    attrDrawer.onSettingChange = (setting) => {
        const $settingRenew = Ux.clone(setting);
        $settingRenew.title = $setting.title;
        Ux.of(reference).in({$setting: $settingRenew}).done();
        // reference.?etState({$setting: $settingRenew});
    }
    return attrDrawer;
}
/**
 * ## 「通道」`Ex.yoProChildren`
 * @memberOf module:yo/unfold
 * @param reference
 * @return {*}
 */
const yoProChildren = (reference) => {
    const {
        $setting = {}
    } = reference.state;
    const attrChildren = {};
    attrChildren.$setting = $setting;
    return attrChildren;
}
/**
 * ## 「通道」`Ex.yoProWater`
 *
 * @memberOf module:yo/unfold
 * @return {*}
 */
const yoProWater = () => {
    const user = Ux.isLogged();
    const attrWater = {};
    attrWater.fontColor = "rgba(0,0,0,.10)";

    /* 如果手机号不存在，依旧让水印效果呈现正常 */
    const {mobile = ""} = user;
    attrWater.content = [`${user['realname']} ${mobile.slice(7)}`, `（${user.username}）`];
    return attrWater;
}
export default {
    yoProLayout,
    yoProSettingDrawer,
    yoProChildren,
    yoProWater,
}