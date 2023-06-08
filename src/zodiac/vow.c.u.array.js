import __Zn from './zero.module.dependency';
import __Tt from './tree.fn.to.configuration';
import __Vt from './vow.__.fn.u.zone';

const _matrix = (array = [], object = {}, fnExecute, fnPredicate) => {
    if (!__Zn.isEmpty(object)) {
        // 是否检查
        const predicate = __Zn.isFunction(fnPredicate) ? fnPredicate : () => true;
        __Zn.itFull(array, object, (item = {}, key, value) => {
            if (predicate(value)) {
                fnExecute(item, key, value);
            }
        });
    }
};

/**
 * @name zodiac.Uarr
 * @class Uarr
 */
class Uarr {
    constructor(data = []) {
        /*
         * 拷贝节点，原始节点不改变，
         * Stream操作无副作用
         */
        this.data = __Zn.clone(data);
    }

    static create(data = []) {
        __Zn.fxTerminal(!__Zn.isArray(data), 10057, data);
        if (__Zn.isArray(data)) {
            return new Uarr(data);
        }
    }

    /**
     *
     * @param items
     * @returns {zodiac.Uarr}
     */
    matrix(items = {}) {
        _matrix(this.data, items, (item = {}, key, value) => {
            const id = item[key];
            const found = __Zn.elementUnique(value, "key", id);
            if (found) {
                item[key] = found;
            }
        }, __Zn.isArray);
        return this;
    }

    /**
     *
     * @param reference
     * @returns {zodiac.Uarr}
     */
    mount(reference) {
        this.reference = reference;
        return this;
    }

    /**
     *
     * @param applyFun
     * @returns {zodiac.Uarr}
     */
    each(applyFun) {
        __Vt.uEach(this.data, applyFun);
        return this;
    }

    /**
     *
     * @param attr
     * @returns {zodiac.Uarr}
     */
    remove(...attr) {
        __Vt.uCut.apply(this, [this.data].concat(attr));
        return this;
    }

    /**
     *
     * @param keys
     * @returns {zodiac.Uarr}
     */
    slice(...keys) {
        const reference = this.data;
        this.data = __Zn.slice.apply(this, [reference].concat(keys));
        return this;
    }

    /**
     *
     * @returns {zodiac.Uarr}
     */
    debug() {
        __Zn.dgDebug(this.data, "Uarr 调试");
        return this;
    }

    /**
     *
     * @param mapping
     * @param override
     * @returns {zodiac.Uarr}
     */
    mapping(mapping = {}, override = false) {
        const result = [];
        this.data.forEach(item => result.push(__Vt.uExpand(item, mapping, override)));
        this.data = result;
        return this;
    }

    /**
     *
     * @param func
     * @returns {zodiac.Uarr}
     */
    filter(func) {
        if (__Zn.isFunction(func)) this.data = this.data.filter(func);
        return this;
    }

    /**
     *
     * @param field
     * @param func
     * @returns {zodiac.Uarr}
     */
    convert(field, func) {
        if (field && __Zn.isFunction(func)) __Zn.itElement(this.data, field, func);
        return this;
    }

    /**
     *
     * @param field
     * @param any
     * @returns {zodiac.Uarr}
     */
    add(field, any) {
        if (field) this.data.forEach(item => item[field] = __Zn.isFunction(any) ? any(item) : any);
        return this;
    }

    sort(func) {
        if (__Zn.isFunction(func)) this.data = this.data.sort(func);
        return this;
    }

    /**
     *
     * @param func
     * @returns {zodiac.Uarr}
     */
    map(func) {
        if (__Zn.isFunction(func)) this.data = this.data.map(func);
        return this;
    }

    /**
     *
     * @returns {*}
     */
    to() {
        return this.data;
    }

    /**
     *
     * @param config
     * @returns {zodiac.Uarr}
     */
    tree(config = {}) {
        this.data = __Tt.toTree(this.data, config);
        return this;
    }
}

export default Uarr;