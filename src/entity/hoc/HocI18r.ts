import {Langue} from "environment";
import HocContainer from "./HocContainer";
import * as Immutable from 'immutable';
import Fn from './I.common';

class HocI18r implements HocContainer {
    private readonly hoc: any = {};
    private readonly ready: boolean = false;
    private props: any = {};

    constructor(hoc: Object) {
        const shared = Langue();
        if (shared) {
            Object.assign(hoc, shared);
        }
        /* Clone */
        this.hoc = Immutable.fromJS(hoc).toJS();
        this.ready = true;
    }

    name() {
        return "HocI18r";
    }

    is(): boolean {
        return this.ready;
    }

    to(): any {
        let ret = {};
        Object.assign(ret, this.hoc);
        return ret;
    }

    merge(metadata: any): HocI18r {
        Fn.toMerge(this.hoc, metadata);
        return this;
    }

    _(key: string): any {
        let targetKey = key;
        // 防止其他key乱入
        if ("string" !== typeof key) {
            key = String(key);
        }
        if (!key.startsWith("_")) {
            targetKey = `_${key}`;
        }
        if (this.hoc) {
            return this.hoc[targetKey];
        }
    }

    bind(props: any): HocI18r {
        this.props = props;
        return this;
    }
}

export default HocI18r;