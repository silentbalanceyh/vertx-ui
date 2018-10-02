import Ux from 'ux';
import * as U from 'underscore';

class RxAct {
    private reference: any;
    private data: any;
    private executor: any = {};
    private redux: any = {};
    private _deleted: Boolean = false;

    private constructor(reference: any) {
        this.reference = reference;
    }

    static from(reference: any) {
        return new RxAct(reference);
    }

    response(data: any) {
        this.data = data;
        return this;
    }

    close(fnClose) {
        const ref = this.executor;
        if (this.reference) {
            const {fnClose} = this.reference.props;
            if (fnClose) {
                ref["fnClose"] = fnClose;
            }
        }
        if (!ref.hasOwnProperty('fnClose') && U.isFunction(fnClose)) {
            ref["fnClose"] = fnClose;
        }
        return this;
    }

    clear() {
        if (this.reference) {
            const ref = this.executor;
            const {fnClear} = this.reference.props;
            if (fnClear) {
                ref["fnClear"] = fnClear;
            }
        }
        return this;
    }

    view(values: any) {
        if (this.reference) {
            const ref = this.executor;
            const {fnView} = this.reference.props;
            if (fnView) {
                if (values) {
                    ref['fnView'] = () => fnView(values);
                } else {
                    ref['fnView'] = () => fnView(this.data);
                }
            }
        }
        return this;
    }

    deleted() {
        this._deleted = true;
        return this;
    }

    tree(values: any) {
        if (this.reference) {
            let treeData: any = {};
            if (values) {
                treeData = Ux.pipeTree(this.reference, values, this._deleted);
            } else if (this.data) {
                treeData = Ux.pipeTree(this.reference, this.data, this._deleted);
            }
            this.redux["grid.tree"] = treeData;
        }
        return this;
    }

    query(filters: any = {}) {
        if (this.reference) {
            this.redux["grid.query"] = Ux.pipeQuery(this.reference, filters);
        }
        return this;
    }

    reset() {
        const ref = this.reference;
        if (ref.form) {
            const executor = this.executor;
            executor['fnReset'] = (event) => {
                event.preventDefault();

            }
        }
    }


    to() {
        // 是否有更新的状态
        if (this.reference) {
            // 有状态则书写Redux状态树
            if (!Ux.isEmpty(this.redux)) {
                Ux.writeTree(this.reference, this.redux);
            }
        }
        // 是否包含执行方法
        const executor: any = this.executor;
        ["fnClear", "fnClose", "fnView"].filter(key => executor.hasOwnProperty(key))
            .forEach(item => executor[item]());
    }
}

export default RxAct