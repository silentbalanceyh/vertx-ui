import Ux from 'ux';
import Cv from './O.fn.constant';

export default (params) => {
    //  API-Login 登录
    params.password = Ux.encryptAES(params.password, Ux.Env['SECRET_AES']);
    return Ux.ajaxPush('/Login/user/login', params, Cv.OPTIONS).then((response = {}) => {
        const { user = {}, token } = response;
        const $user = Ux.clone(user);
        $user.token = token;
        return Ux.promise($user);
    });
}