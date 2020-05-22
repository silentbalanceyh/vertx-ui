import Ux from 'ux';

export default {
    /*
     * 读取模型下所有表单配置
     */
    forms: (identifier) => Ux.ajaxGet(`/api/ui/forms/:identifier`, {identifier})
        .then(response => {
            response.forEach(item => {
                if (item.metadata) {
                    /* 没有设计 */
                    if (!item.metadata.hasOwnProperty('design')) {
                        item.metadata.design = true;
                    }
                }
            })
            return Ux.promise(response);
        }),
    /*
     * 读取模型下所有列表配置
     */
    lists: (identifier) => Ux.ajaxGet(`/api/ui/lists/:identifier`, {identifier}),
    /*
     * 读取表单配置
     */
    form: (params) => Ux.ajaxGet(`/api/ui/form/:code`, params),
    /*
     * 读取表单中的 actions
     * {
     *      "control": <control>
     *      "name": <name>
            "op": []
     * }
     */
    action: (params = {}) => {
        if (params.remote) {
            return Ux.ajaxPost(`/api/form/actions`, params);
        } else {
            /* 无权限 */
            const permit = {};
            const {op = {}} = params;
            Object.keys(op).forEach(field => permit[field] = !!op[field]);
            return Ux.promise(permit);
        }
    }
}