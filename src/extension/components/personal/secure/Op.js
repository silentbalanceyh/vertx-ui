import Ex from 'ex';
import Ux from "ux";

const $opPassword = (reference) => (params) => {
    /*
     * 不检查旧密码
     */
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
        header.$icon = "information";
        header.$type = "info";
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