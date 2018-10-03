import Ux from "ux";
import U from "underscore";

const toChildren = (object = {}, counter = []) => {
    const children = [];
    Ux.itObject(object, (field, value) => {
        const each = {};
        each.name = field;
        if (U.isObject(value)) {
            // 值为对象
            each.color = "#06c";
            each.name = "[Object] " + field;
            each.children = toChildren(value, counter);
        } else if (U.isArray(value)) {
            // 值为数组
            each.color = "#660";
        } else {
            counter.push(true);
            each.color = "#963";
            each.children = [];
            if ("number" === typeof value) {
                each.children.push({
                    name: value,
                    color: "#f9c"
                });
            } else if ("boolean" === typeof value) {
                each.children.push({
                    name: value,
                    color: "#9cf"
                });
            } else {
                let literal = value;
                if (48 < literal.length) {
                    literal = literal.substring(0, 48) + "...";
                }
                each.children.push({
                    name: literal,
                    color: "#6c6"
                });
            }
        }
        children.push(each);
    });
    return children;
};
export default {
    toChildren
}