import { Langue } from "environment";

import HocContainer from "./HocContainer";

class HocI18n implements HocContainer {
    private hoc: any = {};
    private ready: boolean = false;
    private lg: any = {};
    private props: any = {};

    constructor(name: String, hoc: Object) {
        this.lg = Langue(name);
        this.hoc = hoc;
        this.ready = true;
    }

    is(): boolean {
        return this.ready;
    }

    to(): any {
        let ret = {};
        if (this.hoc) {
            // TODO: 合并Hoc
        }
        Object.assign(ret, this.lg);
        return ret;
    }

    _(key: string): any {
        let targetKey = key;
        if (!key.startsWith("_")) {
            targetKey = `_${key}`;
        }
        if (this.lg) {
            return this.lg[targetKey];
        }
    }

    bind(props: any): HocI18n {
        this.props = props;
        return this;
    }
}

export default HocI18n;
