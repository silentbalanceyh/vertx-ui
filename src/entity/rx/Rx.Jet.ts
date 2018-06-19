class Jet {
    private _promise: Function = undefined;
    private _success: Function = undefined;
    private _failure: Function = undefined;
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

    failure(failure: Function) {
        this._failure = failure;
        return this;
    }

    promise(promise: Function) {
        this._promise = promise;
        return this;
    }

    to() {
        const promise = this._promise;
        const success = this._success;
        return (reference: any) => {
            if (promise) {

            } else {
                return success
            }
        }
    }
}

export default Jet;