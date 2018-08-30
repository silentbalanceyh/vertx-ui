import Ux from 'ux';
import * as U from 'underscore';

const thenCallback = (promise, {
    isDialog, ref, postDialog, callback, postKey
}, resolve) => {
    // 这里的promise一定是一个可执行函数，并且返回一个完整的Promise，Delay执行
    return promise().then(data => {
        if (isDialog) {
            postDialog(ref, postKey, () => {
                Ux.rdxSubmitting(ref, false);
                let ret = callback(data);
                if (!ret) ret = {};
                resolve(ret);
            }, data)
        } else {
            postDialog(ref, postKey);
            Ux.rdxSubmitting(ref, false);
            let ret = callback(data);
            if (!ret) ret = {};
            resolve(ret);
        }
    })
};

class RxOp {
    private validation: any = [];
    private _success;
    private _confirmKey;
    private _postKey;
    private isPromiseReturn: Boolean = true;
    private isDialog: Boolean = true;
    private reference;

    private constructor(reference: any) {
        this.reference = reference;
    }

    static from(reference: any) {
        return new RxOp(reference);
    }

    direct() {
        this.isPromiseReturn = false;
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

    dialog(key) {
        if (key) {
            this._postKey = key;
            this.isDialog = true;
        }
        return this;
    }

    message(key) {
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
        // 防重复提交
        Ux.rdxSubmitting(ref, true);
        // 验证处理
        for (let idx = 0; idx < validation.length; idx++) {
            const item = validation[idx];
            if (item.cond) {
                if (isPromiseReturn) {
                    const message = Ux.fromPath(ref, "modal", "error", item.key);
                    return Ux.rdxReject(message);
                } else {
                    // 暂时只在Reject部分处理isPromiseReturn
                    Ux.showDialog(ref, item.key, () => Ux.rdxSubmitting(ref, false));
                    return;
                }
            }
        }// 是否设置了postKey
        const postDialog = this.isDialog ? Ux.showDialog : Ux.showMessage;
        const isDialog = this.isDialog;
        const postKey = this._postKey;
        // 验证成功，是否执行confirm流程
        if (confirmKey) {
            return new Promise((resolve) => Ux.showDialog(ref, confirmKey,
                () => thenCallback(promise, {
                    isDialog, ref, postDialog, callback, postKey
                }, resolve), {},
                () => {
                    Ux.rdxSubmitting(ref, false);
                    resolve({})
                }));
        } else {
            return new Promise((resolve) => thenCallback(promise, {
                isDialog, ref, postDialog, callback, postKey
            }, resolve));
        }
    }
}

export default RxOp;