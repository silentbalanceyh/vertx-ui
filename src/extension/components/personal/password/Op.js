import Ex from 'ex';
import Ux from "ux";

const $opPassword = (reference) => Ex.xtOp(reference, {
    /*
     * 先不考虑 failure 的情况
     */
    success: params => {
        const input = {};
        input.password = params['npassword'];
        return Ex.I.password(input)/* 更新密码回调处理 */
            .then(data => Ex.showDialog(reference, {
                data, /* 响应数据 */
                key: "password", /* 专用窗口对应的key */
            }))
            /* closed 参数这里不显示 */
            .then(() => Ex.Op.$opLogout(reference));
    }
});
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