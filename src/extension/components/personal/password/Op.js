import Ex from 'ex';
import Ux from "ux";

const $opPassword = (reference) => (params) => {
    const user = Ux.isLogged();
    const opassword=Ux.encryptMD5( params['opassword']);
    if(opassword !== user.password){
        return Ux.ajaxDialog(reference, {
            key: "passwordError", /* 专用窗口对应的key */
        });
    }
    const request = Ux.valueRequest(params);
    request.password = params['npassword'];
    return Ex.I.password(request)/* 更新密码回调处理 */
        .then(data => Ux.ajaxDialog(reference, {
            data, /* 响应数据 */
            key: "password", /* 专用窗口对应的key */
        }))
        /* closed 参数这里不显示 */
        .then(() => Ex.Op.$opLogout(reference));
};
const yoAlert = (reference) => {
    const alert = Ux.fromHoc(reference, "alert");
    if (alert) {
        const header = {};
        header.$icon = "warning";
        header.$type = "warning";
        header.$size = 40;
        header.$alert = Ux.clone(alert);
        return header;
    }
};
export default {
    yoAlert,
    actions: {
        $opPassword
    }
}