import __Zn from './zero.module.dependency';

const onConfirm = (fnEvent, content) => (event) => {
    if (__Zn.isFunction(fnEvent)) {
        event.preventDefault();
        if (content) {
            /* 带确认框 */
            const md = __Zn.v4Modal()
            md.confirm({
                content,
                onOk: () => fnEvent()
            })
        } else {
            /* 不带确认 */
            fnEvent();
        }
    } else {
        __Zn.fxFatal(10105);
    }
};
const onLinker = (config = {}, valueSupplier) => {
    const values = {};
    const {linker} = config;
    if (linker && !__Zn.isEmpty(linker) && __Zn.isFunction(valueSupplier)) {
        const fields = Object.keys(linker)
            .map(field => linker[field])
            .filter(field => !!field);
        const sourceValues = valueSupplier(fields);
        if (!__Zn.isEmpty(sourceValues)) {
            Object.keys(sourceValues).forEach(formField => Object.keys(linker)
                .filter(linkerField => formField === linker[linkerField])
                .forEach(linkerField => {
                    values[linkerField] = sourceValues[formField];
                }));
        }
    }
    return values;
};
export default {
    onConfirm,
    onLinker,
}