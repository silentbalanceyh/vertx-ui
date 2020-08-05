import Abs from '../abyss';
import Cv from '../constant';
import moment from "moment";

const optFalse = (options, accessSet, key) => {
    if (!accessSet.has(key)) {
        options[key] = false;
    }
}

export default {
    aclOp: (options = {}, ops) => {
        /*
     * 操作专用 __acl 处理
     */
        if (ops['__acl']) {
            const {__acl = {}} = ops;
            const {access = []} = __acl;
            if (0 < access.length) {
                const accessSet = new Set(access);
                [
                    "search.enabled",
                    "search.advanced",
                    "op.row.edit",
                    "op.row.delete"
                ].forEach(key => optFalse(options, accessSet, key))
            }
            delete ops['__acl'];
        }
    },
    aclData: ($inited = {}, reference, $edition) => {
        const acl = {};
        /*
         * __acl 字段提取执行最终的
         * $inited 的处理在任何场景下都生效，所以在外层处理
         */
        const {__acl = {}} = $inited;
        const {access = [], fields = [], edition = []} = __acl;
        {
            if (Abs.isEmpty(__acl)) {
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
                        processed[field] = Cv.FORBIDDEN;
                    }
                })
                acl.$inited = processed;
            }
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
            const {$options = {}} = reference.props;
            if (false === $options['op.row.edit']) {
                /*
                 * 操作模式下的控制
                 */
                acl.$edition = false;
            } else {
                /*
                 * ACL第三优先级
                 */
                // 替换相关数据
                if (Abs.isEmpty(__acl)) {
                    /*
                     * 不带权限控制
                     */
                    acl.$edition = {};
                } else {
                    const replaced = {};
                    const editSet = new Set(edition);
                    fields.forEach(field => replaced[field] = editSet.has(field));
                    const original = $edition ? Abs.clone($edition) : {};
                    original.__acl = replaced;  // 执行后
                    original.__aclRaw = __acl;  // 原始
                    acl.$edition = original;
                }
            }
        }
        return acl;
    },
    aclSubmit: (params = {}, reference) => {
        const data = Abs.clone(params);
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
                if (Cv.FORBIDDEN === data[key]) {
                    // 移除
                    return true;
                }

                /*
                 * 时间格式移除
                 */
                if (moment.isMoment(data[key])) {
                    const year = data[key].year();
                    return 9999 === year;
                }

                /*
                 * undefined 需要执行计算
                 */
                if (!Abs.isEmpty(__aclRaw)) {
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
}