import U from "underscore";
import Types from "./Ux.Type";

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
    static create(data = []) {
        if (U.isArray(data)) {
            return new Uarr(data);
        } else {
            console.error("[Kid] The input data must be Array.");
        }
    }

    constructor(data = []) {
        this.data = data;
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
                result.push(object);
            });
        }
        this.data = result;
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
