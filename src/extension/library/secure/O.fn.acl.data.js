import Ux from "ux";

export default ($inited = {}, $edition) => {
    const acl = {};
    /*
     * __acl 字段提取执行最终的
     * $inited 的处理在任何场景下都生效，所以在外层处理
     */
    const {__acl = {}} = $inited;
    const {access = [], fields = [], edition = []} = __acl;
    {
        if (Ux.isEmpty(__acl)) {
            /*
             * 不带权限控制
             */
            acl.$inited = $inited;
        } else {
            const accessSet = new Set(access);
            const processed = {};
            fields.forEach(field => {
                if (accessSet.has(field)) {
                    processed[field] = $inited[field];
                } else {
                    processed[field] = Ux.Env.FORBIDDEN;
                }
            });
            acl.$inited = processed;
        }
    }
    if (false === $edition) {
        // 全表单只读，则不需要考虑其他，直接赋值
        acl.$edition = $edition;
    } else {
        // 替换相关数据
        if (Ux.isEmpty(__acl)) {
            /*
             * 不带权限控制
             */
            acl.$edition = {};
        } else {
            const replaced = {};
            const editSet = new Set(edition);
            fields.forEach(field => replaced[field] = editSet.has(field));
            const original = Ux.clone($edition);
            original.__acl = replaced;
            acl.$edition = original;
        }
    }
    return acl;
}
