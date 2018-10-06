import U from "underscore";
import Type from '../Ux.Type';
import moment from 'moment';
import E from "../Ux.Error";
import Ux from "ux";

class Uson {
    constructor(data = []) {
        this.data = data;
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
        if (ref) Ux.each(ref, applyFun);
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
            this.data = Ux.field(this.data, field, values);
        }
        return this;
    }

    valid() {
        this.data = Ux.valueValid(this.data);
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
        this.data = Ux.slice.apply(this, [this.data].concat(keys));
        return this;
    }

    mapping(mapping = {}) {
        this.data = Ux.expand(this.data, mapping);
        return this;
    }

    convert(mapping = {}) {
        const target = {};
        const reference = this.data;
        Type.itObject(mapping, (from, to) => {
            if (reference.hasOwnProperty(from)) {
                target[to] = reference[from];
            }
        });
        this.data = target;
        return this;
    }

    date(config = {}) {
        const values = this.data;
        Type.itObject(config, (field, pattern = {}) => {
            if (values.hasOwnProperty(field)) {
                values[field] = moment(values[field], pattern);
            }
        });
        this.data = values;
        return this;
    }

    remove(...fields) {
        Ux.cut.apply(this, [this.data].concat(fields));
        return this;
    }

    selected(field) {
        const key = Ux.pipeSelected(this.reference);
        if (key) {
            this.data[field] = key[0];
        }
        return this;
    }

    selectedData(field) {
        const value = Ux.pipeSelected(this.reference, true, field);
        if (value) {
            this.data[field] = value;
        }
        return this;
    }

    execute(executor) {
        if (U.isFunction(executor)) {
            this.data = executor(this.data);
        }
        return this;
    }

    debug(flag = "") {
        Ux.dgDebug(this.data, flag);
        return this;
    }

    to() {
        return this.data;
    }
}

export default Uson;
