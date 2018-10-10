import U from "underscore";
import Types from "../Ux.Type";
import E from '../Ux.Error';
import Ux from "ux";

class Uarr {
    constructor(data = []) {
        this.data = data;
    }

    static create(data = []) {
        E.fxTerminal(!U.isArray(data), 10057, data);
        if (U.isArray(data)) {
            return new Uarr(data);
        }
    }

    /**
     * 特殊方法
     * @param items
     * @returns {Uarr}
     */
    matrix(items = {}) {
        Ux.matrix(this.data, items, (item = {}, key, value) => {
            const id = item[key];
            const found = Types.elementUnique(value, "key", id);
            if (found) {
                item[key] = found;
            }
        }, U.isArray);
        return this;
    }

    mount(reference) {
        this.reference = reference;
        return this;
    }

    each(applyFun) {
        Ux.each(this.data, applyFun);
        return this;
    }

    remove(...attr) {
        Ux.cut.apply(this, [this.data].concat(attr));
        return this;
    }

    slice(...keys) {
        const reference = this.data;
        this.data = Ux.slice.apply(this, [reference].concat(keys));
        return this;
    }

    mapping(mapping = {}) {
        const result = [];
        this.data.forEach(item => result.push(Ux.expand(item, mapping)));
        this.data = result;
        return this;
    }

    flat(field = "children") {
        const reference = this.data;
        this.data = Types.elementFlat(reference, field, true);
        return this;
    }

    filter(func) {
        if (U.isFunction(func)) this.data = this.data.filter(func);
        return this;
    }

    convert(field, func) {
        if (field && U.isFunction(func)) Types.itElement(this.data, field, func);
        return this;
    }

    add(field, any) {
        if (field) this.data.forEach(item => item[field] = U.isFunction(any) ? any(item) : any);
        return this;
    }

    sort(func) {
        if (U.isFunction(func)) this.data = this.data.sort(func);
        return this;
    }

    to() {
        return this.data;
    }

    tree(key = "id", parentKey = "pid") {
        const root = this.data.filter(item => !item[parentKey]);
        const reference = this.data;
        root.forEach(item => item.children = Ux.Child.byField(reference, {
            field: parentKey, item, key
        }));
        this.data = root;
        return this;
    }
}

export default Uarr;
