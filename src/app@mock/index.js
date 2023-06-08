// Zero Framework全Mock接口
import get_app_name_$name from './data.store/entry.get_app_name_$name';
import post_captcha_image from "./data.store/entry.post_captcha_image";

import post_oauth_login from "./data.store/entry.post_oauth_login";
import post_oauth_authorize from "./data.store/entry.post_oauth_authorize";
import post_oauth_token from "./data.store/entry.post_oauth_token";
import post_api_user_logout from "./data.store/entry.post_api_user_logout";
import post_api_my_menu_fetch from "./data.store/main.post_api_my_menu_fetch";

import get_api_user from "./data.store/entry.get_api_user";
import get_api_app from "./data.store/main.get_api_app";
import get_api_menus from './data.store/main.get_api_menus';
import get_api_company_employee_$eid from "./data.store/entry.get_api_company_employee_$eid";
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    get_app_name_$name,         // 首页应用加载
    post_captcha_image,         // 验证码专用
    post_oauth_login,           // 账号登录专用
    post_oauth_authorize,       // 申请临时授权码
    post_oauth_token,           // 申请授权令牌
    post_api_user_logout,       // 登出机器人
    post_api_my_menu_fetch,
    get_api_company_employee_$eid,
    get_api_user,               // 登录获取个人账号信息
    get_api_menus,              // 读取应用菜单
    get_api_app,                // 读取应用配置
}