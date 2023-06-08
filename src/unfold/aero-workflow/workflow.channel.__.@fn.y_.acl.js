import Ux from "ux";

export default (reference) => ({
    yoAcl: (formConfig = {}) => {
        const {$inited = {}, $edition = true} = reference.props;
        if ($edition) {
            const {__acl = {}} = $inited;
            const edition = {};
            if ("boolean" === typeof __acl.edition) {
                // 布尔值
                if (false === __acl.edition) {
                    return false;
                }
            } else {
                if (Ux.isObject(__acl.edition)) {
                    /*
                     * Workflow 和基础表单的对接流程
                     * 控制字段读写
                     * 根据 $inited 中的数据处理，有值为 true
                     */
                    Object.keys($inited).filter(key => !Ux.isObject($inited[key])).forEach(key => {
                        if (__acl.edition.hasOwnProperty(key)) {
                            edition[key] = __acl.edition[key];
                        } else {
                            edition[key] = true;
                        }
                    });
                    const {form = {}} = formConfig;
                    Ux.itField(form, (field) => {
                        if (__acl.edition.hasOwnProperty(field) && !__acl.edition[field]) {
                            edition[field] = false;
                        }
                    })
                }
                // 处理结果和处理意见的填写
                if (Ux.isArray(__acl.readOnly)) {
                    __acl.readOnly.forEach(field => edition[field] = false);
                }
                // Normalized for System Field of Workflow

            }
            return edition;
        } else return $edition;
    },
})