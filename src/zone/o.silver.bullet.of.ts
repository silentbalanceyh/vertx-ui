import __Is from './fn.under.is.decision';
import __To from './fn.under.to.expr';
import __Dg from './fn.debug.dg.logging';
import __Rd from './fn.unity.random';
import __Fn from './o.silver.bullet.fn';
import __Ay from './fn.atomic.async';
import Doc from './o.silver.bullet.of.doc';

const __logInfo = (reference, stateRef, flag) => {
    let name;
    if (reference.displayName) {
        name = reference.displayName;
    } else {
        name = ""
    }
    __Dg.dgDebug({
        state: stateRef,
        _state: reference.state,
        props: reference.props
    }, `（${flag}）状态更新 / ${name}`, "#7D26CD");
}

// 属性优先 -> xxx
// 状态优先 -> _xxx
class OfState {
    private readonly _reference;
    private readonly _refState;
    private readonly _refProps;

    static create(reference) {
        return new OfState(reference);
    }

    private constructor(reference: any = {}) {
        this._reference = reference;
        this._refState = reference.state ? reference.state : {};
        this._refProps = reference.props;
    }

    // 属性优先（正常模式）
    submitting(): boolean {
        let submitting = this._refProps.$submitting;
        if (undefined !== submitting) {
            return submitting;
        } else {
            return this._refState.$submitting;
        }
    }

    // 状态优先（私有模式）
    _submitting(): boolean {
        let submitting = this._refState.$submitting;
        if (undefined !== submitting) {
            return submitting;
        } else {
            return this._refProps.$submitting;
        }
    }
}

/*
 * Ux.fn(reference) 等价，移除原始的 Ex.?x(reference)
 */
class OfFn {
    private readonly _reference;
    /*
     * 函数名处理
     * - 正式函数名为 close 等价于 rxClose
     * - 则对应的其他函数名为：
     *   After => close_
     *   Before => _close
     */
    private readonly _fn: any;

    static create(reference) {
        return new OfFn(reference);
    }

    private constructor(reference) {
        this._reference = reference;
        this._fn = __Fn.fn(reference);
    }

    // ------------------------ fn(reference) ----------------------
    ioIn(key: string, data: any) {
        return this._fn.rxAssist(key, data, false);
    }

    ioOut(key: string, data: any) {
        return this._fn.rxAssist(key, data, true);
    }

    // QVH
    // row: h, criteria: q, projection: v
    qrV(columnMy, addOn) {
        return this._fn.rxViewV(columnMy, addOn);
    }

    qrQ(condition, qrc = false) {
        const state: any = {};
        state.$condition = condition;
        state.isQrC = qrc;
        return this._fn.rxViewQ(state);
    }

    qrFilter(qr: any = undefined, addOn = {}) {
        return __Ay.pass(this._fn.rxFilter(qr, addOn), qr);
    }

    // 提交
    submitting(data: any = {}) {
        if (undefined === data.$spinning) {
            data.$spinning = true;
        }
        return this._fn.rxSubmitting(true, data);
    }

    submitted(data: any = {}) {
        if (undefined === data.$spinning) {
            data.$spinning = false;
        }
        return this._fn.rxSubmitting(false, data);
    }

    // 关闭
    closeAnd(data: any = {}, addOn: any = undefined) {
        const updated = {
            $submitting: false,
        };
        if (addOn) {
            Object.assign(updated, addOn);
        }
        return this._fn.rxClose(data, updated);
    }


    close(data: any = {}, addOn: any = undefined) {
        return this._fn.rxClose(data, addOn);
    }

    closeOnly(data: any = {}, addOn: any = undefined) {
        const updated = {$stop: true};
        if (addOn) {
            Object.assign(updated, addOn);
        }
        return this._fn.rxClose(data, updated);
    }

    // ------------------------ 行函数 ----------------------
    open(id, data, record) {
        return this._fn.rxOpen(id, data, record);
    }

    view(id, record, metadata) {
        return this._fn.rxView(id, record, metadata);
    }

    // ------------------------ After ----------------------
    open_(data: any) {
        return this._fn.rxPostOpen(data);
    }

    close_(data: any) {
        return this._fn.rxPostClose(data);
    }

    delete_(data) {
        return this._fn.rxPostDelete(data, this._reference);
    }

    selected_(data: any) {
        return this._fn.rxPostSelected(data);
    }

}

/**
 * @class _Of
 */
class Of {
    private readonly _reference;
    private readonly _state: any = {};
    private readonly _doc: any;
    /*
     * Ux.of(reference)._.xxx 调用模式代表父调用
     * Ux.of(reference).xxx 代表当前调用
     */
    public readonly _: OfFn = null;
    public readonly is: OfState = null;

    static create(reference) {
        return new Of(reference);
    }

    private constructor(reference) {
        this._reference = reference;
        this._ = OfFn.create(reference);
        this.is = OfState.create(reference);
        this._doc = Doc._Of;    // JSDoc
    }

    // ------------------------ in --------------------
    paging(): Of {
        this._state.$paging = true;
        return this;
    }

    paged(): Of {
        this._state.$paging = false;
        return this;
    }

    in(state: any): Of {
        if (__Is.isObject(state)) {
            Object.assign(this._state, state);
        }
        return this;
    }

    up(): Of {
        // forceUpdate
        this._state.$up = __Rd.randomString(12);
        return this;
    }

    open(): Of {
        this._state.$visible = true;
        return this;
    }

    hide(): Of {
        this._state.$visible = false;
        return this;
    }

    readying(): Of {
        this._state.$ready = false;
        return this;
    }

    ready(): Of {
        this._state.$ready = true;
        return this;
    }

    spinning(): Of {
        this._state.$spinning = true;
        return this;
    }

    spun(): Of {
        this._state.$spinning = false;
        return this;

    }

    submitting(): Of {
        this._state.$submitting = true;
        return this;
    }

    submitted(): Of {
        this._state.$submitting = false;
        return this;
    }

    loading(withSubmit: boolean = true): Of {
        if (withSubmit) {
            this._state.$submitting = true;
        }
        this._state.$loading = true;
        return this;
    }

    load(withSubmit: boolean = true): Of {
        if (withSubmit) {
            this._state.$submitting = false;
        }
        this._state.$loading = false;
        return this;
    }

    // ------------------------ 执行 ---------------------
    done(): void {
        const stateRef = this._state;
        __logInfo(this._reference, stateRef, "Done");
        this._reference.setState(stateRef)
    }

    // callback模式
    handle(callbackFn: Function, delaySec: any = undefined): void {
        const stateRef = this._state;
        // reference.setState
        __logInfo(this._reference, stateRef, "Handle");
        this._reference.setState(stateRef, () => {
            if (undefined === delaySec) {
                // 不带 delay 的执行
                callbackFn();
            } else {
                // 带 delay 的执行
                __To.toLoading(callbackFn, delaySec);
            }
        })
    }

    // future模式
    future(futureFn: Function = () => Promise.resolve(null), delaySec: any = undefined): Promise<any> {
        const stateRef = this._state;
        const ref = this._reference;
        return new Promise((resolve) => {
            // reference.setState()
            __logInfo(this._reference, stateRef, "Future");
            ref.setState(stateRef, () => resolve(ref.state))
        }).then(() => {
            if (__Is.isFunction(futureFn)) {
                if (undefined === delaySec) {
                    return futureFn() as Promise<any>;
                } else {
                    return new Promise((resolve) => __To.toLoading(
                        () => futureFn().then(resolve),
                        delaySec)
                    )
                }
            } else return Promise.resolve(null);
        })
    }

    next(): Promise<any> {
        return this.future();
    }

    // ------------------------ 结束方法（快速模式） ---------------------
    close(data: any = {}): void {
        const __ = this._;
        this.hide().load().handle(() => {
            const promise = __.submitted();
            if (Promise.prototype.isPrototypeOf(promise)) {
                promise.then(() => __.close(data))
            } else {
                __.close(data);
            }
        })
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    of: (reference) => Of.create(reference),
}