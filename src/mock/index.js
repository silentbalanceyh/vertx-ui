// Zero Framework全Mock接口
import get_app_name_$name from './zero-ui/login/get_app_name_$name';
import post_oauth_login from "./zero-ui/login/post_oauth_login";
import post_oauth_token from "./zero-ui/login/post_oauth_token";
import post_oauth_authorize from "./zero-ui/login/post_oauth_authorize";
import get_api_user from "./zero-ui/login/get_api_user";
import get_api_app from "./zero-ui/login/get_api_app";
import get_api_menus from './zero-ui/login/get_api_menus';
import post_api_user_logout from './zero-ui/login/post_api_user_logout';

export default {
    // 登录到主界面
    get_app_name_$name,
    post_oauth_login,
    post_oauth_authorize,
    post_oauth_token,
    get_api_user,
    get_api_app,
    get_api_menus,
    post_api_user_logout,
}