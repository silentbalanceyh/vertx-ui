import Ux from 'ux';
import Ex from 'ex';

const $opProfile = (reference) => (params) => {
    const request = Ux.valueRequest(params);
    if (request.key) delete request.key;
    return Ex.I.profile(request)/* 更新完成 */
        .then(data => Ux.ajaxDialog(reference, {
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
};
export default {
    actions: {
        $opProfile
    }
}