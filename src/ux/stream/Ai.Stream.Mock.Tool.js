import Prop from "../prop/Ux.Prop";
import U from "underscore";
import Value from '../Ux.Value';
import Ai from '../ai/AI';

const keys = (reference) => {
    const grid = Prop.fromHoc(reference, "grid");
    // 启用了 Mock
    const {options = {}} = grid ? grid : {};
    let fields = [];
    if (options['mock.enabled']) {
        const keys = options['mock.keys'];
        if (U.isArray(keys)) {
            fields = keys;
        } else {
            fields = keys.split(",");
        }
    }
    return fields;
};
const input = (source) => {
    let data = {};
    if (U.isArray(source)) {
        /* JsonArray格式专用 */
        data.data = Value.clone(source);
        data.type = Symbol.for("ARRAY");
        data.size = source.length;
    } else if (U.isObject(source)) {
        const fnObject = (object = {}) => {
            const result = {};
            result.data = Value.clone(object);
            result.type = Symbol.for("OBJECT");
            result.size = Object.keys(object).length;
            return result;
        };
        /* List分页专用 */
        if (2 === Object.keys(source).length) {
            const {list, count} = source;
            if (undefined !== list && undefined !== count) {
                data.data = Value.clone(list);
                data.type = Symbol.for("LIST");
                data.size = count;
            } else {
                data = fnObject(source);
            }
        } else {
            data = fnObject(source);
        }
    }
    return data;
};
const filter = (data = {}, $query = {}) => {
    const input = Value.clone(data.data);
    const searcher = Ai.aiSearcher(input);
    const list = searcher.query($query);
    const count = searcher.count($query);
    return {list, count};
};
export default {
    keys,
    input,
    filter
};