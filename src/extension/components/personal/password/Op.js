import Ux from 'ux';
import Ex from 'ex';

const yoForm = (reference) => {
    /* 表单数据 */
    const config = Ux.fromHoc(reference, "form");
    /* 初始化状态专用，格式化form信息 */
    const user = Ux.isLogged();
    const inited = {};
    inited.key = user.key;
    inited.username = user.username;
    /* 合并配置 */
    return Ex.U.yoForm(reference, {
        form: config,
    }, inited);
};
const $opPassword = (reference) => Ex.O.generateOp(reference, {
    /*
     * 先不考虑 failure 的情况
     */
    success: params => {
        const input = {};
        input.password = params.npassword;
        return Ex.I.password(input)/* 更新密码回调处理 */.then(data => Ex.U.yiDialog(reference, {
            data, /* 响应数据 */
            key: "password", /* 专用窗口对应的key */
        })).then(closed => {
            // 清掉Session
            Ux.toLogout();
            // 路由处理
            Ux.toRoute(reference, Ux.Env.ENTRY_LOGIN);
            // 清楚State上的数据
            Ux.eraseTree(reference, ["user"]);
        });
    }
});

export default {
    yoForm,
    actions: {
        $opPassword
    }
}