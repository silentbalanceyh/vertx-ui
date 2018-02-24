import Dg from "./Ux.Debug";
import Env from './Ux.Env';

const put = (reference) => (key, value) => {
    Dg.ensureRuntime(reference);
    if (value && key) {
        if (Object.prototype.isPrototypeOf(value)) {
            value = JSON.stringify(value);
        }
        reference.setItem(key, value);
    }
};

const get = (reference) => (key) => {
    Dg.ensureRuntime(reference);
    if (key) {
        let value = reference.getItem(key);
        try {
            value = JSON.parse(value);
        } catch (error) {
            console.error(error);
        }
        return value;
    }
};

const remove = (reference) => (key) => {
    Dg.ensureRuntime(reference);
    if (key) {
        reference.removeItem(key);
    }
};

const clear = (reference) => () => {
    Dg.ensureRuntime(reference);
    reference.clear();
};

const storeApp = (data) => {
    if (data) {
        const key = Env.KEY_APP;
        put(window.localStorage)(key, data);
    }
    // Fluent for Rxjs
    return data;
};

const storeUser = (data) => {
    if (data) {
        const key = Env.KEY_USER;
        put(window.sessionStorage)(key, data);
    }
};

export default {
    Session : {
        put : put(window.sessionStorage),
        get : get(window.sessionStorage),
        remove : remove(window.sessionStorage),
        clear : clear(window.sessionStorage)
    },
    Storage : {
        put : put(window.localStorage),
        get : get(window.localStorage),
        remove : remove(window.localStorage),
        clear : clear(window.localStorage)
    },
    storeApp,
    storeUser
}
