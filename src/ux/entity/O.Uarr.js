import U from "underscore";
import Abs from '../abyss';
import E from '../error';
import Ele from '../element';
import Dev from '../develop';

import At from './I.atom';
import Ut from '../unity';

/**
 * Stream模式的 JsonArray处理。
 * @class Uarr
 * @deprecated 后溪直接采用Ux更方便。
 */
class Uarr {
    constructor(data = []) {
        /*
         * 拷贝节点，原始节点不改变，
         * Stream操作无副作用
         */
        this.data = Abs.clone(data);
    }

    static create(data = []) {
        E.fxTerminal(!U.isArray(data), 10057, data);
        if (U.isArray(data)) {
            return new Uarr(data);
        }
    }

    matrix(items = {}) {
        At.matrix(this.data, items, (item = {}, key, value) => {
            const id = item[key];
            const found = Ele.elementUnique(value, "key", id);
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
        At.each(this.data, applyFun);
        return this;
    }

    remove(...attr) {
        At.cut.apply(this, [this.data].concat(attr));
        return this;
    }

    slice(...keys) {
        const reference = this.data;
        this.data = Abs.slice.apply(this, [reference].concat(keys));
        return this;
    }

    debug() {
        Dev.dgDebug(this.data, "Uarr 调试");
        return this;
    }

    mapping(mapping = {}, override = false) {
        const result = [];
        this.data.forEach(item => result.push(At.expand(item, mapping, override)));
        this.data = result;
        return this;
    }

    flat(field = "children", current = true) {
        const reference = this.data;
        this.data = Ele.elementFlat(reference, field, current);
        return this;
    }

    filter(func) {
        if (U.isFunction(func)) this.data = this.data.filter(func);
        return this;
    }

    convert(field, func) {
        if (field && U.isFunction(func)) Abs.itElement(this.data, field, func);
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

    map(func) {
        if (U.isFunction(func)) this.data = this.data.map(func);
        return this;
    }

    to() {
        return this.data;
    }

    tree(config = {}) {
        this.data = Ut.toTree(this.data, config);
        return this;
    }

    /*
    tree(key = "id", parentKey = "pid") {
        const root = this.data.filter(item => !item[parentKey]);
        const reference = this.data;
        root.forEach(item => item.children = Ut.elementChild(reference, {
            field: parentKey, item, key
        }));
        this.data = root;
        return this;
    }*/
}

export default Uarr;
