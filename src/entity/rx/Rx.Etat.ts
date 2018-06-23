import * as U from 'underscore';
import StateOut from '../state/StateOut';
import Ux from 'ux';
import {Taper} from 'environment';

class Etat {
    private _form: boolean = false;
    private _cab: undefined;
    private _cabFile: undefined;
    private _logger: undefined;
    private _state: undefined;
    private _loading: any;
    private _dispatchTo: undefined;
    private _stateTo: undefined;
    private _op: {};

    /**
     * required必须使用这种方式绑定
     * @param requiredFile
     */
    private constructor(requiredFile) {
        this._cab = requiredFile;
    }

    static from(requiredFile) {
        if (!requiredFile) {
            console.error("[ZI] Input 'requiredFile' must be valid.");
        }
        return new Etat(requiredFile);
    }

    form() {
        this._form = true;
        return this;
    }

    logger(logger: any) {
        this._logger = logger;
        return this;
    }

    cab(cabFile) {
        this._cabFile = cabFile;
        return this;
    }

    op(op: any, opFun: Function) {
        if (!this._op) this._op = {};
        if (U.isFunction(opFun)) {
            this._op[op] = opFun;
        }
        return this;
    }

    state(state) {
        this._state = state;
        return this;
    }

    loading(...loading) {
        const loadingArr = [];
        loading.forEach(item => {
            loadingArr.push(item);
        });
        this._loading = loadingArr;
        return this;
    }

    connect(object, dispatch: boolean) {
        if (dispatch) {
            if (object && !object.hasOwnProperty('fnOut')) {
                object.fnOut = Taper.fnFlush
            }
            this._dispatchTo = object;
        } else {
            this._stateTo = object;
        }
        return this;
    }

    to() {
        const config: any = {};
        // Cab专用
        if (this._cab && this._cabFile) {
            config['i18n.name'] = this._cabFile;
            config['i18n.cab'] = this._cab;
        }
        // 是否开启Form
        if (this._form) {
            config.form = true;
        }
        // 加载效果
        if (this._loading) {
            config.loading = this._loading;
        }
        // Logger日志专用
        if (this._logger) {
            config.logger = this._logger;
        }
        // 连接设置
        const connect: any = {};
        if (this._dispatchTo || this._stateTo) {
            connect.s2p = this._stateTo ? this._stateTo : (state) => new StateOut(state).to();
            connect.d2p = this._dispatchTo ? this._dispatchTo : {};
            config.connect = connect;
        }
        // 状态设置
        if (this._state) {
            config.state = this._state;
        }
        // 操作设置
        if (this._op) {
            config.op = this._op;
        }
        Ux.dgMonitor(config);
        return config;
    }
}

export default Etat;