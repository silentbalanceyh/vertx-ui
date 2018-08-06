import Ux from 'ux';
import Mock from './mock';

const fnLogin = Ux.rxJet().success((values: any, reference: any) => {
    if ("lang.yu" !== values.username) {
        Ux.showMessage(reference, "user");
        return;
    }
    if ("lang.yu" !== values.password) {
        Ux.showMessage(reference, "password");
        return;
    }
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
}).to();
const fnReset = Ux.rxJet().success((values: any, reference: any) => {
    Ux.formReset(reference);
}).to();
export default {
    fnLogin,
    fnReset
}