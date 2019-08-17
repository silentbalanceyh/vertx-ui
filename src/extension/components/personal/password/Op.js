import Ex from 'ex';

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

export default {
    actions: {
        $opPassword
    }
}