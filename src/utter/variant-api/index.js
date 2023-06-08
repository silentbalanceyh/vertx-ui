import api_get_app from './i.get.__.v.app';
import api_get_company_employee_$eid from './i.get.__.v.company.employee.@eid';

import api_get_menus from './i.get.__.v.menus';
import api_get_model_identifier_$identifier from './i.get.__.v.model.identifier.@identifier';
import api_get_module from './i.get.__.v.module';

import api_get_ui_form_$code from './i.ui.get.__.v.ui.form.@code';
import api_get_ui_forms_$identifier from './i.ui.get.__.v.ui.forms.@identifier';
import api_get_ui_lists_$identifier from './i.ui.get.__.v.ui.lists.@identifier';

import api_get_user from './i.secure.get.__.v.user';

import api_post_form_actions from './i.ui.post.__.v.form.actions';
import api_post_ui_control from './i.ui.post.__.v.ui.control';
import api_post_ui_ops from './i.ui.post.__.v.ui.ops';
import api_post_ui_page from './i.ui.post.__.v.ui.page';
import api_post_ui_visitor_$identifier_$page from './i.ui.post.__.v.ui.visitor.@identifier.@page';

import api_post_user_logout from './i.secure.post.__.v.user.logout';
import api_post_user_password from './i.secure.post.__.v.user.password';
import api_post_user_profile from './i.secure.post.__.v.user.profile';

import rest_post_oauth_login from './r.post.__.v.oauth.login';
import rest_post_oauth_authorize from './r.post.__.v.oauth.authorize';
import rest_post_oauth_token from './r.post.__.v.oauth.token';

import api_put_todo_confirm_$key from './i.put.__.v.todo.confirm.@key';
import api_put_todo_reject_$key from './i.put.__.v.todo.reject.@key';

import api_get_job_info_mission_$key from './i.job.get.__.v.job.info.mission.@key';
import api_post_job_info_by_sigma from './i.job.post.__.v.job.info.by.sigma';
import api_put_job_start_$key from './i.job.put.__.v.job.start.@key';
import api_put_job_stop_$key from './i.job.put.__.v.job.stop.@key';
import api_put_job_resume_$key from './i.job.put.__.v.job.resume.@key';

import api_post_x_api_search from './i.api.post.__.v.x_api.search';
import api_get_x_api_$key from './i.api.get.__.v.x_api.@key';

import api_get_relation from './i.cmdb.get.__.v.relation';
import api_post_relation_save from './i.cmdb.post.__.v.ox.relation.save';
import api_post_relation_remove from './i.cmdb.post.__.v.ox.relation.remove';

import rest_get_app_name_$name from './r.get.__.v.app.name.@name';

import d_api_get_$type_category_$code from './i.dict.get.__.v.@type.category.@code';
import d_api_get_$type_tabular_$code from './i.dict.get.__.v.@type.tabular.@code';
import d_api_get_type_categories_$type from './i.dict.get.__.v.type.categories.@type';
import d_api_get_type_tabulars_$type from './i.dict.get.__.v.type.tabulars.@type';
import d_api_post_types_categories from './i.dict.post.__.v.types.categories';
import d_api_post_types_tabulars from './i.dict.post.__.v.types.tabulars';

export default {
    d_api_get_$type_tabular_$code,
    d_api_get_type_tabulars_$type,
    d_api_post_types_tabulars,

    d_api_get_$type_category_$code,
    d_api_get_type_categories_$type,
    d_api_post_types_categories,

    api_get_relation,
    api_post_relation_remove,
    api_post_relation_save,

    api_get_app,
    api_get_company_employee_$eid,
    /* job */
    api_get_job_info_mission_$key,
    api_post_job_info_by_sigma,
    api_put_job_start_$key,
    api_put_job_stop_$key,
    api_put_job_resume_$key,
    /* api */
    api_post_x_api_search,
    api_get_x_api_$key,

    api_get_menus,
    api_get_model_identifier_$identifier,
    api_get_module,

    api_get_ui_form_$code,
    api_get_ui_forms_$identifier,
    api_get_ui_lists_$identifier,

    api_get_user,

    api_post_form_actions,
    api_post_ui_control,
    api_post_ui_ops,
    api_post_ui_page,
    api_post_ui_visitor_$identifier_$page,

    api_post_user_logout,
    api_post_user_password,
    api_post_user_profile,

    api_put_todo_confirm_$key,
    api_put_todo_reject_$key,

    rest_post_oauth_login,
    rest_post_oauth_authorize,
    rest_post_oauth_token,

    rest_get_app_name_$name,
}