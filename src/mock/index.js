import post_oauth_login from './mock-empty/data';
import post_oauth_authorize from './mock-empty/data';
import post_oauth_token from './mock-empty/token';

import get_api_user from './get/api-user';
import get_app from './get/api-app';
import get_menus from './get/api-menus';

import FormData from './editor/form.json';
import ModelData from './editor/model.json';
import AssistData from './editor/assist.json';

export default {
    post_oauth_login,
    post_oauth_authorize,
    post_oauth_token,
    get_api_user,
    "get_app_name_vie.app.zui": get_app,
    "get_api_app": get_app,
    "get_api_menus": get_menus,
    Editor: {
        form: FormData,
        model: ModelData,
        assist: AssistData,
    }
}