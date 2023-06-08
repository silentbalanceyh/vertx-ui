import Ux from "ux";
import __API from './variant-api';
import __IP from './levy.__.fn.ask.processor';

const withAction = (params = {}) => {
    if (params.remote) {
        return __IP.askRapid(__API.api_post_form_actions, params);
    } else {
        /* 无权限 */
        const permit = {};
        const {op = {}} = params;
        Object.keys(op).forEach(field => permit[field] = !!op[field]);
        return Ux.promise(permit);
    }
}
const withApp = (appData = {}) => {
    /* 已经初始化过一次 */
    if (appData['appKey']) {
        /* 二次初始化完成后 */
        return Ux.promise(appData);
    } else {
        /* 直接调用接口 Ux.ajaxGet("/api/app") */
        return __IP.askRapid(__API.api_get_app);
    }
}
const withCompany = () => {
    const user = Ux.isLogged();
    if (user.employeeId) {
        return __IP.askRapid(__API.api_get_company_employee_$eid, user);
    } else {
        return Ux.promise({});
    }
}
const withTodo = (params = {}, confirmed = true) => {
    if (confirmed) {
        return __IP.askRapid(__API.api_put_todo_confirm_$key, params);
    } else {
        return __IP.askRapid(__API.api_put_todo_reject_$key, params);
    }
}
export default {
    withAction,
    withApp,
    withCompany,
    withTodo,
}