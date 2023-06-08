import __Zn from './zero.module.dependency';

const aclOp = (options = {}, ops) => {
    /*
     * 操作专用 __acl 处理
     */
    if (ops['__acl']) {
        const {__acl = {}} = ops;
        const {access = []} = __acl;
        if (0 < access.length) {
            /*
             * filter 函数
             */
            const fnFalse = (options, accessSet, key) => {
                if (!accessSet.has(key)) {
                    options[key] = false;
                }
            }
            const accessSet = new Set(access);
            [
                "search.enabled",
                "search.advanced",
                "op.row.edit",
                "op.row.delete"
            ].forEach(key => fnFalse(options, accessSet, key))
        }
        delete ops['__acl'];
    }
    /*
     * 限制性功能开放
     */
    const parsed = {};
    ops.filter(item => options.hasOwnProperty(item.clientKey))
        .forEach(item => parsed[item.clientKey] = item.text);
    return parsed;
};
const aclData = ($inited = {}, reference, $edition) => {
    const acl = {};
    /*
     * __acl 字段提取执行最终的
     * $inited 的处理在任何场景下都生效，所以在外层处理
     */
    const {$options = {}, $mode} = reference.props;
    const {__acl = {}} = $inited;
    const {access = [], fields = [], edition} = __acl;
    if (__Zn.isEmpty(__acl)) {
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
                processed[field] = __Zn.Env.FORBIDDEN;
            }
        })
        acl.$inited = processed;
    }
    if (false === $edition) {
        // 全表单只读，则不需要考虑其他，直接赋值
        acl.$edition = $edition;
    } else {
        /*
         * 1. 编程模式第一优先级
         * 2. 操作模式第二优先级
         * 3. ACL第三优先级
         */
        if (false === $options['op.row.edit']) {
            /*
             * 操作模式下的控制，如果禁用了编辑
             * 那么直接表单不可编辑，但需要排除一种情况
             *
             */
            if (__Zn.Env.FORM_MODE.EDIT === $mode) {
                acl.$edition = false;
            } else {
                acl.$edition = {};
            }
        } else {
            /*
             * ACL第三优先级
             */
            // 替换相关数据
            if (__Zn.isEmpty(__acl) || true === edition) {
                /*
                 * 不带权限控制（编程模式权限控制）
                 */
                if (__Zn.isNotEmpty($edition)) {
                    acl.$edition = $edition;
                } else {
                    acl.$edition = {};
                }
            } else {
                const replaced = {};
                if (__Zn.isEmpty(edition)) {
                    // 无远程 __acl
                    if (__Zn.isNotEmpty($edition)) {
                        acl.$edition = $edition;
                    }
                } else {
                    const editSet = new Set(edition);
                    fields.forEach(field => replaced[field] = editSet.has(field));
                    const original = $edition ? __Zn.clone($edition) : {};
                    original.__acl = replaced;  // 执行后
                    original.__aclRaw = __acl;  // 原始
                    acl.$edition = original;
                }
            }
        }
    }
    return acl;
}
const aclSubmit = (params = {}, reference) => {
    const data = __Zn.clone(params);
    const {$edition = {}} = reference.props;
    const {__aclRaw = {}} = $edition;
    Object.keys(data)
        .filter(key => {
            /*
             * 移除 $button
             */
            if (key.startsWith("$")) {
                return true;
            }

            /*
             * 字符串类型 $button
             */
            if (__Zn.Env.FORBIDDEN === data[key]) {
                // 移除
                return true;
            }

            /*
             * 时间格式移除
             */
            if (__Zn.isMoment(data[key])) {
                const year = data[key].year();
                return 9999 === year;
            }

            /*
             * undefined 需要执行计算
             */
            if (!__Zn.isEmpty(__aclRaw)) {
                /*
                 * 开启了权限控制
                 */
                const {access = []} = __aclRaw;
                if (0 < access.length) {
                    const accessSet = new Set(access);
                    if (accessSet.has(key)) {
                        /*
                         * 如果出现在访问列表中，这种情况的 undefined
                         * 设置为 null
                         */
                        if (undefined === data[key]) {
                            data[key] = null;
                        }
                        return false;
                    } else {
                        /*
                         * 没出现在访问列表中
                         * 删除该字段
                         */
                        return true;
                    }
                } else return false;
            } else return false;
        })
        .forEach(key => delete data[key]);
    return data;
}
export default {
    aclOp,
    aclData,
    aclSubmit,
}