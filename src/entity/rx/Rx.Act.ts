import Ux from "ux";
import * as U from "underscore";

class RxAct {
    private reference: any;
    private data: any;
    private executor: any = {};
    private redux: any = {};
    private state: any = {};
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
        if (!ref.hasOwnProperty("fnClose") && U.isFunction(fnClose)) {
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
            if (U.isFunction(fnView)) {
                const $data = values ? values : this.data;
                ref["fnView"] = () => fnView($data);
            }
        }
        return this;
    }

    tab(tabIndex: Number) {
        if (this.reference) {
            const ref = this.executor;
            const {fnTab} = this.reference.props;
            if (U.isFunction(fnTab)) {
                ref['fnTab'] = () => fnTab(tabIndex);
            }
        }
        return this;
    }

    deleted() {
        this._deleted = true;
        return this;
    }

    json(data) {
        const $data = data ? data : this.data;
        Ux.dgFileJson($data);
        return this;
    }

    tree(values: any) {
        if (this.reference) {
            const $data = values ? values : this.data;
            this.redux["grid.tree"] = Ux.pipeTree(this.reference, $data, this._deleted);
        }
        return this;
    }

    submitted() {
        this.redux["status.submitting"] = false;
        this.state['$loading'] = false;
        return this;
    }

    query(filters: any = {}) {
        if (this.reference) {
            this.redux["grid.query"] = Ux.pipeQuery(this.reference, filters);
        }
        return this;
    }

    reset(fields: any) {
        const ref = this.reference;
        const executor = this.executor;
        executor["fnReset"] = event => {
            if (event && U.isFunction(event.preventDefault)) {
                event.preventDefault();
            }
            if (U.isArray(fields) && 0 < fields.length) {
                Ux.formReset(ref, fields);
            } else {
                Ux.formReset(ref);
            }
        };
        return this;
    }

    items(dataArray) {
        const ref = this.reference;
        const executor = this.executor;
        executor["fnItems"] = () => Ux.pipeReset(ref, dataArray);
        return this;
    }

    mount(key: any, value: any) {
        if (!this.redux) this.redux = {};
        this.redux[key] = value;
        return this;
    }

    to(callback) {
        try {
            // 是否包含执行方法
            const executor: any = this.executor;
            [
                "fnReset", // 重置表单专用函数
                "fnItems" // 重置list.items专用节点数据
            ].filter(key => executor.hasOwnProperty(key))
                .forEach(item => executor[item]());
            // 是否有更新的状态
            if (this.reference) {
                // 专用处理状态中的提交
                let etat = {
                    submitting: false,
                    $loading: false
                };
                if (0 < Object.keys(this.state).length) {
                    Object.assign(etat, this.state);
                }
                // submitting = false
                this.reference.setState(etat);
                // 有状态则书写Redux状态树
                if (!Ux.isEmpty(this.redux)) {
                    Ux.writeTree(this.reference, this.redux);
                }
            }
            [
                "fnClear", // 清除数据专用函数
                "fnClose", // 关闭窗口、Tab页专用函数
                "fnView", // 从添加切换到编辑的专用函数
                "fnTab", // 切换Tab页专用函数
            ].filter(key => executor.hasOwnProperty(key))
                .forEach(item => executor[item]());
            if (U.isFunction(callback)) {
                callback(this.data);
            }
        } catch (error) {
            // 从Error中读取
            Ux.E.fxJs(10098, error);
            throw error;
        }
    }
}

export default RxAct;
