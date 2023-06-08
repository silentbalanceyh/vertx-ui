import Ux from "ux";
/*
 * Settings configuration
 * 可读取设置配置处理（基础设置）
 * {
 *     layout,
 *     colorPrimary,
 *     title
 *     navTheme
 * }
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default async (reference, menuData = []) => {
    // Fetch mySetting
    const setting = {};
    setting.layout = "mix";                             // 布局
    setting.colorPrimary = Ux.Env['CSS_COLOR'];         // CSS Color
    const {$app} = reference.props;
    setting.title = $app._("title");                    // Title
    setting.navTheme = "light";                         // Light
    return setting;
}