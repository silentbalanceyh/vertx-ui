import Ux from 'ux';
import Mock from './mock';

const fnLogin = (values: any, reference: any) => {

    Ux.ajaxPush("/auth/login", values, Mock.fnLogin).then(response => {
        response.token = Ux.randomString(32);
        Ux.storeUser(response);
        Ux.writeTree(reference, {user: response});
        const {$router} = reference.props;
        // 地址栏参数
        const redirectUri = Ux.toQueryParameter("target");
        if (redirectUri) {
            // 返回重定向页面（登陆前）
            $router.to(redirectUri);
        } else {
            // 进入管理主页
            $router.to(Ux.Env.ENTRY_ADMIN);
        }
    })
};
const _validate = (reference, values: any) => {
    if ("lang.yu" !== values.username) {
        Ux.showMessage(reference, "employee.js");
        return false;
    }
    if ("lang.yu" !== values.password) {
        Ux.showMessage(reference, "password");
        return false;
    }
    return true;
};
const $opLogin = (reference: any) => (values: any) => {
    if (_validate(reference, values)) {
        return Ux.ajaxPush("/auth/login", values, Mock.fnLogin).then(response => {
            response.token = Ux.randomString(32);
            Ux.storeUser(response);
            Ux.writeTree(reference, {
                user: response,
                "status.submitting": null
            });
            Ux.toOriginal(reference);
        });
    }
};
export default {
    $opLogin
}