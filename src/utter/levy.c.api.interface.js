import __API from './variant-api';
import __IP from './levy.__.fn.ask.processor';
import __Shd from './levy.__.fn.i.failover.common';
import __Wth from './levy.__.fn.with.branch';
import __Wtt from './levy.__.fn.with.forest';
import Ux from 'ux';

class _I {
    // GET /api/model/identifier/:identifier
    static attributes(identifier) {
        return __IP.askRapid(__API.api_get_model_identifier_$identifier,            /* ...args*/ identifier);
    }

    // GET /app/name/:name
    static app(failure) {
        const runner = Ux.clone(__API.rest_get_app_name_$name);
        runner.outFail = failure;
        return __IP.askRapid(runner);
    }

    // GET /api/app
    static application() {
        return __Shd.iApplication();
    }

    // GET /api/menus
    static menus() {
        return __Shd.iMenus();
    }

    static inited() {
        return Ux.parallel([
            __Shd.iApplication(),       // 应用程序
            __Shd.iMenus()              // 菜单
            /*
             * catch之后解决 401 无法登录一直加载的问题
             * 如果用户账号信息在内页丢失，则直接返回 401 远程
             * 最终导致跳转回到登录界面，但此处执行过程必须 catch
             * 异常信息以防止页面 Pending 在该页，一直处于 Loading
             */
        ]).catch(error => console.error(error));
    }

    // GET /api/module
    static module(uri = "") {
        return __IP.askRapid(__API.api_get_module,                                  /* ...args*/ uri);
    }

    // POST /oauth/login
    static login(request = {}, options = {}) {
        return __IP.askWith(__API.rest_post_oauth_login, /* ...options */ options,  /* ...args*/ request);
    }

    // POST /oauth/authorize
    static authorize(request = {}) {
        return __IP.askRapid(__API.rest_post_oauth_authorize,                       /* ...args*/ request);
    }

    // POST /oauth/token
    static token(request = {}) {
        return __IP.askRapid(__API.rest_post_oauth_token,                           /* ...args*/ request);
    }

    // POST /api/user/logout
    static logout() {
        return __IP.askRapid(__API.api_post_user_logout);
    }

    // GET /api/ui/form/:code
    static form(params = {}) {
        return __IP.askRapid(__API.api_get_ui_form_$code,                           /* ...args*/ params);
    }

    // GET /api/ui/forms/:identifier
    static forms(identifier) {
        return __IP.askRapid(__API.api_get_ui_forms_$identifier,                    /* ...args*/ identifier)
    }

    // GET /api/ui/lists/:identifier
    static lists(identifier) {
        return __IP.askRapid(__API.api_get_ui_lists_$identifier,                    /* ...args*/ identifier);
    }


    // GET /api/user
    static user() {
        return __IP.askRapid(__API.api_get_user);
    }

    // POST /api/user/password
    static password(params = {}) {
        return __IP.askRapid(__API.api_post_user_password,                          /* ...args*/ params);
    }

    // POST /api/user/profile
    static profile(params = {}) {
        return __IP.askRapid(__API.api_post_user_profile,                           /* ...args*/ params);
    }

    // POST /api/ui/page
    static page(params = {}) {
        return __IP.askRapid(__API.api_post_ui_page,                                /* ...args*/ params);
    }

    // POST /api/ui/control
    static control(params = {}) {
        return __IP.askRapid(__API.api_post_ui_control,                             /* ...args*/ params);
    }

    // POST /api/ui/visitor/:identifier/:page
    static visitor(params = {}) {
        return __IP.askRapid(__API.api_post_ui_visitor_$identifier_$page,           /* ...args*/ params);
    }

    // POST /api/ui/ops
    static ops(params = {}) {
        return __IP.askRapid(__API.api_post_ui_ops,                                 /* ...args*/ params);
    }

    // PUT /api/todo/confirm/:key
    // PUT /api/todo/reject/:key
    static todo(params = {}, confirmed = true) {
        return __Wth.withTodo(params, confirmed);
    }

    // -------------------------------->  任务 API
    // GET /api/job/info/mission/:key
    static mission(key) {
        return __IP.askRapid(__API.api_get_job_info_mission_$key,                   /* ...args*/  key);
    }

    // POST /api/job/info/by/sigma
    static jobs(params) {
        return __IP.askRapid(__API.api_post_job_info_by_sigma,                      /* ...args*/ params);
    }

    // PUT /api/job/start/:key
    static jobStart(key) {
        return __IP.askRapid(__API.api_put_job_start_$key,                          /* ...args*/ key);
    }

    // PUT /api/job/stop/:key
    static jobStop(key) {
        return __IP.askRapid(__API.api_put_job_stop_$key,                           /* ...args*/ key);
    }

    // PUT /api/job/resume/:key
    static jobResume(key) {
        return __IP.askRapid(__API.api_put_job_resume_$key,                         /* ...args*/ key);
    }

    // GET /api/relation
    static relation() {
        return __IP.askRapid(__API.api_get_relation);
    }

    // POST /api/ox/relation/save
    static relationSave(relations = []) {
        return __IP.askRapid(__API.api_post_relation_save,                          /* ...args*/ relations);
    }

    // POST /api/ox/relation/remove
    static relationDelete(keys = []) {
        return __IP.askRapid(__API.api_post_relation_remove,                        /* ...args*/ keys);
    }

    // POST /api/x-api/search
    static apis(params) {
        return __IP.askRapid(__API.api_post_x_api_search,                           /* ...args*/ params);
    }

    // GET /api/x-api/:key
    static uri(key) {
        return __IP.askRapid(__API.api_get_x_api_$key,                              /* ...args*/ key);
    }

    // -------------------------------->  Branch With Api （选择性执行）
    // POST /api/form/actions
    static action(params = {}) {
        return __Wth.withAction(params);
    }

    // GET /api/company/employee/:eid
    static company() {
        return __Wth.withCompany();
    }

    // -------------------------------->  三合一
    // GET /api/:type/tabular/:code
    // GET /api/type/tabulars/:type
    // POST /api/types/tabulars
    static tabular(params = {}) {
        return __Shd.iTabular(params);
    }

    // GET /api/:type/category/:code
    // GET /api/type/categories/:type
    // POST /api/types/categories
    static category(params = {}) {
        return __Shd.iCategory(params);
    }

    // -------------------------------->  树型（森林算法）
    static forest(type, mode = "REPLACE") {
        return __Wtt.withForest(type, mode);
    }
}

export default _I;