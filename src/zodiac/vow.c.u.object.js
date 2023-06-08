import __Zn from './zero.module.dependency';
import __Vt from './vow.__.fn.u.zone';
import dayjs from "dayjs";

const _to = (value) => {
    if (value) {
        if (__Zn.isFunction(value)) {
            const result = value();
            return result ? result : {};
        } else {
            return value;
        }
    } else return {};
};
const _field = (instance, name, value) => {
    if (instance && "string" === typeof name) {
        let $instance = __Zn.immutable(instance);
        // 如果value为undefined（2参数，读取）
        if (value) {
            // 【二义性处理】Function和值
            value = _to(value);
            if (0 <= name.indexOf('.')) {
                const path = name.split('.');
                $instance = $instance.setIn(path, value);
            } else {
                $instance = $instance.set(name, value);
            }
        } else {
            if (0 <= name.indexOf('.')) {
                const path = name.split('.');
                $instance = $instance.getIn(path);
            } else {
                $instance = $instance.get(name);
            }
        }
        // 返回读取的最终结果
        return __Zn.isFunction($instance.toJS) ? $instance.toJS() : $instance;
    }
};

/**
 * @name zodiac.Uson
 * @class Uson
 */
class Uson {
    constructor(data = {}) {
        this.data = __Zn.clone(data);
    }

    static create(data = []) {
        __Zn.fxTerminal(!__Zn.isObject(data), 10058, data);
        if (__Zn.isObject(data)) {
            return new Uson(data);
        }
    }

    /**
     *
     * @param reference
     * @returns {zodiac.Uson}
     */
    mount(reference) {
        this.reference = reference;
        return this;
    }

    /**
     *
     * @param applyFun
     * @returns {zodiac.Uson}
     */
    each(applyFun) {
        const ref = this.data;
        if (ref) __Vt.uEach(ref, applyFun);
        return this;
    }

    /**
     *
     * @param field
     * @param any
     * @returns {zodiac.Uson}
     */
    add(field, any) {
        if (any) {
            let values;
            if (__Zn.isFunction(any)) {
                values = any(this.reference);
            } else {
                values = any;
            }
            this.data = _field(this.data, field, values);
        }
        return this;
    }

    /**
     *
     * @returns {zodiac.Uson}
     */
    valid() {
        this.data = __Zn.valueValid(this.data);
        return this;
    }

    /**
     *
     * @param keys
     * @returns {zodiac.Uson}
     */
    keep(keys = []) {
        const target = {};
        const reference = this.data;
        keys.forEach(key => {
            const value = reference[key];
            if (undefined !== value) {
                target[key] = value;
            }
        });
        this.data = target;
        return this;
    }

    /**
     *
     * @param keys
     * @returns {zodiac.Uson}
     */
    slice(...keys) {
        this.data = __Zn.slice.apply(this, [this.data].concat(keys));
        return this;
    }

    /**
     *
     * @param mapping
     * @returns {zodiac.Uson}
     */
    mapping(mapping = {}) {
        this.data = __Vt.uExpand(this.data, mapping);
        return this;
    }

    /**
     *
     * @param mapping
     * @returns {zodiac.Uson}
     */
    convert(mapping = {}) {
        const target = {};
        const reference = this.data;
        __Zn.itObject(mapping, (from, to) => {
            if (reference.hasOwnProperty(from)) {
                target[to] = reference[from];
            }
        });
        this.data = target;
        return this;
    }

    /**
     *
     * @param config
     * @returns {zodiac.Uson}
     */
    date(config = {}) {
        const values = this.data;
        __Zn.itObject(config, (field, pattern = {}) => {
            if (values.hasOwnProperty(field)) {
                values[field] = dayjs(values[field], pattern);
            }
        });
        this.data = values;
        return this;
    }

    /**
     *
     * @param fields
     * @returns {zodiac.Uson}
     */
    remove(...fields) {
        __Vt.uCut.apply(this, [this.data].concat(fields));
        return this;
    }

    /**
     *
     * @param executor
     * @returns {zodiac.Uson}
     */
    execute(executor) {
        if (__Zn.isFunction(executor)) {
            this.data = executor(this.data);
        }
        return this;
    }

    /**
     *
     * @param flag
     * @returns {zodiac.Uson}
     */
    debug(flag = "") {
        __Zn.dgDebug(this.data, flag);
        return this;
    }

    /**
     *
     * @returns {*}
     */
    to() {
        return this.data;
    }
}

export default Uson;