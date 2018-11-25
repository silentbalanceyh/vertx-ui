import Ux from 'ux';
import * as U from 'underscore';

const thenCallback = (promise, {
    isDialog, isWindow, isReduxSubmit,
    ref, postDialog, callback, postKey
}, resolve) => {
    // 这里的promise一定是一个可执行函数，并且返回一个完整的Promise，Delay执行
    const executed = promise();
    Ux.E.fxTerminal(!(executed instanceof Promise), 10088, executed);
    if (executed instanceof Promise) {
        return executed.then(data => {
            const fnCallback = () => {
                if (isReduxSubmit) Ux.rdxSubmitting(ref, false);
                let ret = callback(data);
                if (!ret) ret = {};
                resolve(ret);
            };
            // isWindow使用核心模式
            if (isWindow) {
                // 如果出现了postDialog的参数
                if (isDialog) {
                    postDialog(ref, postKey, fnCallback, data)
                } else {
                    postDialog(ref, postKey);
                    fnCallback();
                }
            } else {
                fnCallback();
            }
        });
    }
};

class RxOp {
    private validation: any = [];
    private _success;
    private _failure;
    private _confirmKey;
    private _postKey;
    private isPromiseReturn: Boolean = false; // 默认不使用Promise的Reject流程
    private isDialog: Boolean = true;
    private isWindowUse: Boolean = false; // 默认不使用窗口
    private isReduxSubmit: Boolean = true; // 启用Redux提交
    private reference;

    private constructor(reference: any) {
        this.reference = reference;
    }

    static from(reference: any) {
        return new RxOp(reference);
    }

    submitting(on: Boolean = true) {
        this.isReduxSubmit = on;
        return this;
    }

    direct() {
        this.isPromiseReturn = false;
        return this;
    }

    reject() {
        this.isPromiseReturn = true;
        return this;
    }

    verify(...inputes) {
        if (inputes) {
            const reference = this.validation;
            for (let idx = 0; idx < inputes.length - 1; idx = idx + 2) {
                const cond = inputes[idx];
                const key = inputes[idx + 1];
                if (undefined !== key) {
                    const item: any = {};
                    item.cond = U.isFunction(cond) ? cond() : cond;
                    item.key = key;
                    reference.push(item);
                }
            }
        }
        return this;
    }

    confirm(key) {
        if (key) {
            this._confirmKey = key;
        }
        return this;
    }

    success(promise) {
        this._success = promise;
        return this;
    }

    failure(fnFailure) {
        if (U.isFunction(fnFailure)) {
            this._failure = fnFailure;
        }
        return this;
    }

    dialog(key) {
        this.isWindowUse = true;
        if (key) {
            this._postKey = key;
            this.isDialog = true;
        }
        return this;
    }

    message(key) {
        this.isWindowUse = true;
        if (key) {
            this._postKey = key;
            this.isDialog = false;
        }
        return this;
    }

    to(callback) {
        const ref = this.reference;
        const validation = this.validation;
        const confirmKey = this._confirmKey;
        const promise = this._success;
        const isPromiseReturn = this.isPromiseReturn;
        const isReduxSubmit = this.isReduxSubmit;
        // 防重复提交
        if (isReduxSubmit) Ux.rdxSubmitting(ref, true);
        // 验证处理
        for (let idx = 0; idx < validation.length; idx++) {
            const item = validation[idx];
            if (item.cond) {
                if (isPromiseReturn) {
                    const message = Ux.fromPath(ref, "modal", "error", item.key);
                    // 需要关闭loading效果
                    return Ux.rdxReject(message);
                } else {
                    // 暂时只在Reject部分处理isPromiseReturn
                    Ux.showDialog(ref, item.key, () => {
                        if (isReduxSubmit) {
                            Ux.rdxSubmitting(ref, false);
                        }
                    });
                    return;
                }
            }
        }// 是否设置了postKey
        const postDialog = this.isDialog ? Ux.showDialog : Ux.showMessage;
        const isDialog = this.isDialog;
        const postKey = this._postKey;
        const isWindow = this.isWindowUse;
        // 验证成功，是否执行confirm流程
        let fnPromise;
        if (confirmKey) {
            fnPromise = new Promise((resolve) => Ux.showDialog(ref, confirmKey,
                () => thenCallback(promise, {
                    postDialog, postKey,
                    isDialog, isWindow, isReduxSubmit,
                    ref, callback
                }, resolve), {},
                () => {
                    if (isReduxSubmit) Ux.rdxSubmitting(ref, false);
                    resolve({})
                }));
        } else {
            fnPromise = new Promise((resolve) => thenCallback(promise, {
                postDialog, postKey,
                isDialog, isWindow, isReduxSubmit,
                ref, callback,
            }, resolve));
        }
        // 是否包含failure
        if (null === this._failure) {
            return fnPromise;
        } else {
            // 异常流
            return fnPromise.catch(errors => this._failure(errors));
        }
    }
}

export default RxOp;