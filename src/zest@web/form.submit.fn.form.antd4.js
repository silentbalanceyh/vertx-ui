import __Io from './form.submit.fn.data.io';
import __Zn from './zero.module.dependency';

const formOut = (reference, request = {}) => {
    // io 配置部分的映射处理
    const {raft} = reference.state;
    if (raft) {
        __Io.dataWrite(request, raft.io);
    }

    // xxx@yyy -> Object
    const formData = {};
    Object.keys(request).forEach(field => {
        if (0 <= field.indexOf("@")) {
            const kv = field.split("@");
            if (!formData[kv[0]]) {
                formData[kv[0]] = {};
            }
            formData[kv[0]][kv[1]] = request[field];
        } else {
            formData[field] = request[field];
        }
    });

    // 更新模式下清空处理
    const {$mode, $inited = {}, config = {}} = reference.props;
    if ($mode === __Zn.Env.FORM_MODE.EDIT) {
        const fieldProc = Object.keys(formData);
        const {form} = config;
        // Fix: https://e.gitee.com/wei-code/issues/table?issue=I6VP1J
        const hidden = form?.hidden ?? []; //  form.hidden: [];
        Object.keys($inited)
            .filter(field => fieldProc.includes(field))
            .forEach(field => {
                const formValue = formData[field];
                if (undefined === formValue) {
                    /*
                     * 清空值的计算方法
                     * 1）表单模式是 EDIT
                     * 2）初始化数据中有值而 formData 提交中是 undefined，没有出现于表单的不会在 formData 中
                     * 3）文本类型的清空会直接设置成 ""，不用考虑
                     * 4）非文本类型不可以重置为 null（后端序列化会 ignore）
                     *
                     * 将 formData 中包含的原来有值而新值为 undefined 的直接设置为 ""
                     */
                    if (hidden.includes(field)) {
                        formData[field] = null;
                    } else {
                        formData[field] = "";
                    }
                }
            })
    }
    return formData;
}
const formEnd = (reference) =>
    __Zn.of(reference).load().done();
// reference.?etState({
//     $submitting: false,
//     $loading: false
// });

const formRead = (reference, data = {}) => {
    const {$record} = reference.props;
    if ($record && $record.is()) {
        const record = $record.to();
        // eslint-disable-next-line
        for (const key in record) {
            if (record.hasOwnProperty(key)) {
                data[key] = record[key];
            }
        }
    } else {
        const {form} = reference.props;
        data = form.getFieldsValue();
    }
    return data;
};

const formLinker = (data, config = {}, linkerField) => {
    const {linker} = config;
    if (linker && !__Zn.isEmpty(linker) && linkerField) {
        if (data) {
            if (__Zn.isArray(data)) {
                /*
                 * 数组处理
                 */
                if (1 === data.length) {
                    const response = data[0];
                    return formLinker(response, config);
                }
            } else {
                /*
                 * 递归处理
                 */
                const hitField = Object.keys(linker)
                    .filter(field => linker[field] === linkerField)
                    .filter(field => undefined !== field);
                if (1 === hitField.length) {
                    return data[hitField[0]];
                }
            }
        }
    }
};
export default {
    formEnd,
    formOut,
    // 特殊方法
    formRead,
    formLinker,
}