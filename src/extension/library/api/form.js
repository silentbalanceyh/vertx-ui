import Ux from 'ux';

export default {
    /*
     * 读取表单配置
     */
    form: (params) => Ux.ajaxGet(`/api/form/:control`, params),
    /*
     * 读取表单中的 actions
     * {
     *      "control": <control>
     *      "name": <name>
            "op": []
     * }
     */
    action: (params) => {
        if (params.remote) {
            return Ux.ajaxPost(`/api/form/actions`, params);
        } else {
            /* 无权限 */
            const permit = {};
            Object.keys(params.op).forEach(field => permit[field] = !!params.op[field]);
            return Promise.resolve(permit);
        }
    }
}