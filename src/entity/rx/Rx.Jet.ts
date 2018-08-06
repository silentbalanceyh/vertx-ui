class Jet {
    private _promise: Function = undefined;
    private _success: Function = undefined;
    private _reject: Function = undefined;
    private _validate: Function = undefined;

    private constructor() {
    }

    static from() {
        return new Jet();
    }

    validate(validate: Function) {
        this._validate = validate;
        return this;
    }

    success(success: Function) {
        this._success = success;
        return this;
    }

    reject(reject: Function) {
        this._reject = reject;
        return this;
    }

    promise(promise: Function) {
        this._promise = promise;
        return this;
    }

    to() {
        const promise: any = this._promise;
        const success = this._success;
        const reject = this._reject;
        const validate = this._validate;
        return () => {
            if (promise) {
                if (!success) {
                    console.info("[ZI] Promise mode require 'success' callback function.");
                }
                return {promise, success, reject, validate}
            } else {
                return success
            }
        }
    }
}

export default Jet;