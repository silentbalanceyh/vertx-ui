import U from "underscore";
import Type from '../Ux.Type';
import Immutable from "immutable";
import moment from 'moment';
import E from "../Ux.Error";

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

    to() {
        return this.data;
    }
}

export default Uson;
