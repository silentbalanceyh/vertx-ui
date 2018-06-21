import U from "underscore";
import Types from "../Ux.Type";

const _findChild = (item = {}, key, pkey, array = []) => {
    const pValue = item[key];
    const children = array.filter(inner => inner[pkey] === pValue);
    if (0 < children.length) {
        children.forEach(child => {
            child.children = _findChild(child, key, pkey, array);
        });
    }
    return children;
};

class Uarr {
    constructor(data = []) {
        this.data = data;
    }

    static create(data = []) {
        if (U.isArray(data)) {
            return new Uarr(data);
        } else {
            console.error("[Kid] The input data must be Array.");
        }
    }

    mount(items = {}) {
        if (0 < Object.keys(items).length) {
            const reference = this.data;
            Types.itFull(reference, items, (item = {}, key, value) => {
                if (U.isArray(value)) {
                    const id = item[key];
                    const found = Types.elementUnique(value, "key", id);
                    if (found) {
                        item[key] = found;
                    }
                }
            });
            this.data = reference;
        }
        return this;
    }

    remove(...attr) {
        const reference = this.data;
        if (reference) {
            reference.forEach(item => {
                attr.forEach(field => {
                    delete item[field];
                })
            })
        }
        this.data = reference;
        return this;
    }

    each(applyFun) {
        this.data.forEach(item => applyFun(item));
        return this;
    }

    mapping(mapping = {}) {
        const result = [];
        if (0 < Object.keys(mapping).length) {
            const reference = this.data;
            reference.forEach(item => {
                const object = {};
                for (const from in mapping) {
                    const to = mapping[from];
                    object[from] = item[to];
                }
                result.push(Object.assign(object, item));
            });
        }
        this.data = result;
        return this;
    }

    flat(field = "children") {
        const reference = this.data;
        this.data = Types.elementFlat(reference, field);
        return this;
    }

    filter(func) {
        if (U.isFunction(func)) {
            let reference = this.data;
            reference = reference.filter(func);
            this.data = reference;
        }
        return this;
    }

    convert(field, func) {
        if (field && U.isFunction(func)) {
            Types.itElement(this.data, field, func);
        }
        return this;
    }

    add(field, any) {
        if (field) {
            let reference = this.data;
            reference.forEach(item => {
                item[field] = U.isFunction(any) ? any(item) : any;
            });
        }
        return this;
    }

    sort(func) {
        if (U.isFunction(func)) {
            let reference = this.data;
            reference = reference.sort(func);
            this.data = reference;
        }
        return this;
    }

    to() {
        return this.data;
    }

    tree(key = "", pkey = "") {
        const root = this.data.filter(item => !item[pkey]);
        const reference = this.data;
        root.forEach(item => {
            item.children = _findChild(item, key, pkey, reference);
        });
        this.data = root;
        return this;
    }
}

export default Uarr;
