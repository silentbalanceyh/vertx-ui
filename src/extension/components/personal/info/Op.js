import Ux from 'ux';
import Ex from 'ex';

const $opProfile = (reference) => Ex.xtOp(reference, {
    success: params => {
        // 删除 key
        if (params.key) {
            delete params.key;
        }
        return Ex.I.profile(params)/* 更新完成 */
            .then(data => Ex.showDialog(reference, {
                data, /* 响应数据 */
                key: "profile", /* 专用窗口数据 */
            }))
            .then((response) => {
                const original = Ux.isLogged();
                const inited = Ux.clone(original);
                if (response) {
                    Object.assign(inited, response);
                }
                /* 重新存储用户 */
                Ux.storeUser(inited);
            })
    }
});
export default {
    actions: {
        $opProfile
    }
}