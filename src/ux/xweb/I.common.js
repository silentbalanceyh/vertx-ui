/*
 * 根据 linker 读取 values
 */
import Abs from "../abyss";
import U from "underscore";
import Eng from "../engine";
import T from "../unity";

const xtLinker = (config = {}, valueSupplier) => {
    const values = {};
    const {linker} = config;
    if (linker && !Abs.isEmpty(linker)
        && U.isFunction(valueSupplier)) {
        const fields = Object.keys(linker)
            .map(field => linker[field])
            .filter(field => !!field);
        const sourceValues = valueSupplier(fields);
        if (!Abs.isEmpty(sourceValues)) {
            Object.keys(sourceValues).forEach(formField => Object.keys(linker)
                .filter(linkerField => formField === linker[linkerField])
                .forEach(linkerField => {
                    values[linkerField] = sourceValues[formField];
                }));
        }
    }
    return values;
};

const xtValues = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 提取 Form 中需要提取的字段
     */
    const ref = Eng.onReference(reference, 1);
    if (ref) {
        return xtLinker(config, (fields) => T.formGet(ref, fields));
    } else {
        return {};
    }
};

export default {
    xtValues
}