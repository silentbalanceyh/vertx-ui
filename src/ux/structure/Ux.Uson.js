import U from "underscore";
import Type from '../Ux.Type';
import Immutable from "immutable";
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

    add(field, any) {
        if (field) {
            let $params = Immutable.fromJS(this.data);
            const path = field.split(".");
            $params = $params.setIn(path, any);
            this.data = $params.toJS();
        }
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

    remove(field) {
        if (this.data.hasOwnProperty(field)) {
            delete this.data[field];
        }
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

    to() {
        return this.data;
    }
}

export default Uson;
