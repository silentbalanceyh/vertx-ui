import U from "underscore";
import moment from 'moment';
import E from "../error";
import Dev from '../develop';

import At from './I.atom';
import Ele from '../element';
import Abs from '../abyss';

class Uson {
    constructor(data = {}) {
        this.data = Abs.clone(data);
    }

    static create(data = []) {
        E.fxTerminal(!U.isObject(data), 10058, data);
        if (U.isObject(data)) {
            return new Uson(data);
        }
    }

    mount(reference) {
        this.reference = reference;
        return this;
    }

    each(applyFun) {
        const ref = this.data;
        if (ref) At.each(ref, applyFun);
        return this;
    }

    add(field, any) {
        if (any) {
            let values = null;
            if (U.isFunction(any)) {
                values = any(this.reference);
            } else {
                values = any;
            }
            this.data = At.field(this.data, field, values);
        }
        return this;
    }

    valid() {
        this.data = Ele.valueValid(this.data);
        return this;
    }

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

    slice(...keys) {
        this.data = At.slice.apply(this, [this.data].concat(keys));
        return this;
    }

    mapping(mapping = {}) {
        this.data = At.expand(this.data, mapping);
        return this;
    }

    convert(mapping = {}) {
        const target = {};
        const reference = this.data;
        Abs.itObject(mapping, (from, to) => {
            if (reference.hasOwnProperty(from)) {
                target[to] = reference[from];
            }
        });
        this.data = target;
        return this;
    }

    date(config = {}) {
        const values = this.data;
        Abs.itObject(config, (field, pattern = {}) => {
            if (values.hasOwnProperty(field)) {
                values[field] = moment(values[field], pattern);
            }
        });
        this.data = values;
        return this;
    }

    remove(...fields) {
        At.cut.apply(this, [this.data].concat(fields));
        return this;
    }

    execute(executor) {
        if (U.isFunction(executor)) {
            this.data = executor(this.data);
        }
        return this;
    }

    debug(flag = "") {
        Dev.dgDebug(this.data, flag);
        return this;
    }

    to() {
        return this.data;
    }
}

export default Uson;
