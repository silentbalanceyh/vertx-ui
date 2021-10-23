// Zero Framework全Mock接口
import get_app_name_$name from './zero-ui/login/get_app_name_$name';
import post_oauth_login from "./zero-ui/login/post_oauth_login";
import post_oauth_token from "./zero-ui/login/post_oauth_token";
import post_oauth_authorize from "./zero-ui/login/post_oauth_authorize";
import get_api_user from "./zero-ui/login/get_api_user";
import get_api_app from "./zero-ui/login/get_api_app";
import get_api_menus from './zero-ui/login/get_api_menus';
import post_api_user_logout from './zero-ui/login/post_api_user_logout';
import get_api_module from "./zero-ui/ui/get_api_module";
import get_api_group_by_sigma from "./zero-ui/rbac/get_api_group_by_sigma";
import post_api_ui_ops from "./zero-ui/ui/post_api_ui_ops";
import get_api_columns_group_full from "./zero-ui/ui/get_api_columns_group_full";
import get_api_columns_group_my from "./zero-ui/ui/get_api_columns_group_my";
import post_api_group_search from "./zero-ui/qr/post_api_group_search"

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
    // 界面配置
    get_api_module,
    post_api_ui_ops,
    // RBAC处理 - 用户组
    get_api_group_by_sigma,
    get_api_columns_group_full,
    get_api_columns_group_my,
    post_api_group_search
}