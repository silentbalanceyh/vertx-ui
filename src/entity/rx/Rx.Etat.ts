import * as U from 'underscore';
import StateOut from '../state/StateOut';
import Ux from 'ux';
import {Taper} from 'environment';

class Etat {
    private _form: boolean = false;
    private _cab: undefined;
    private _cabFile: undefined;
    private _logger: undefined;
    private _state: any;
    private _loading: any;
    private _dispatchTo: any = {};
    private _stateTo: any;
    private _raft: any = {};
    private _op: {};

    /**
     * required必须使用这种方式绑定
     * @param requiredFile
     */
    private constructor(requiredFile) {
        this._cab = requiredFile;
        // 默认设置fnOut
        this._dispatchTo = {
            fnOut: Taper.fnFlush
        }
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

    raft(input, value: any) {
        const raftRef: any = this._raft;
        if (!raftRef.hasOwnProperty('enabled')) {
            raftRef.enabled = true;
        }
        if (undefined === value) {
            // 绑定jsx/绑定columns/绑定配置
            if (U.isObject(input)) {
                if (input.hasOwnProperty("_renders")) {
                    // 特殊处理，子表单，动态表单
                    raftRef.dynamic = {};
                    raftRef.dynamic.renders = input._renders;
                    raftRef.dynamic.extensions = input._extensions;
                } else {
                    raftRef.jsx = input;
                }
            } else if (U.isNumber(input)) {
                raftRef.columns = input;
            }
        } else {
            // 双参处理配置
            if (!raftRef.hasOwnProperty("config")) {
                raftRef.config = {};
            }
            raftRef.config[input] = value;
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
            this._dispatchTo = Object.assign(this._dispatchTo, object);
        } else {
            this._stateTo = object;
        }
        return this;
    }

    // 特殊方法
    // zxInit：初始化专用
    init(fnInit: any) {
        if (U.isFunction(fnInit)) {
            // 初始化专用，特殊zero前缀
            this._dispatchTo.zxInit = fnInit;
        }
        return this;
    }

    // rxSearch：搜索专用
    search(fnSearch: any) {
        if (U.isFunction(fnSearch)) {
            // RxSearch专用
            this._dispatchTo.rxSearch = fnSearch;
        }
        return this;
    }

    // 按钮绑定专用
    bind(OP: any = {}) {
        if (!this._op) this._op = {};
        const opRef = this._op;
        Object.keys(OP)
            .filter(key => !!key)
            .filter(key => key.startsWith("$"))
            .map(key => opRef[key] = OP[key]);
        return this;
    }

    // Dialog专用方法，设置$op中的show, hide
    dialog(key = "$_show") {
        if (!this._op) this._op = {};
        this._op['hide'] = Ux.onHide(null, key);
        this._op['show'] = Ux.onShow(null, key);
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
        // 启用了raft模式
        if (this._raft['enabled']) {
            if (!this._raft.hasOwnProperty("columns")) {
                // 默认4列
                this._raft.columns = 4;
            }
            config.raft = this._raft;
        }
        // Logger日志专用
        if (this._logger) {
            config.logger = this._logger;
        } else {
            const {Logger} = Ux;
            const cabFile: String = this._cabFile ? this._cabFile : "";
            let isContainer = false;
            if (config['i18n.cab']) {
                const ns = config['i18n.cab'].ns;
                if (0 <= ns.indexOf("container/") && "UI" === cabFile) {
                    const {Logger} = Ux;
                    this._logger = Logger.container;
                    isContainer = true;
                }
            }
            if (!isContainer) {
                if ("UI" === cabFile) {
                    // 如果是UI.json，则直接使用Logger.page打印，一般为根UI.js专用
                    this._logger = Logger.page;
                } else if (0 <= cabFile.indexOf("Form")) {
                    // 如果包含了Form关键字，则直接使用Logger.form打印
                    this._logger = Logger.form;
                    this._form = true;
                } else if (
                    // 报表和图标专用
                    0 <= cabFile.indexOf("Report") ||
                    0 <= cabFile.indexOf("Chart")
                ) {
                    // 如果包含了Report/Chart关键字
                    this._logger = Logger.stateless;
                } else if (
                    // 如果包含了Filter/List关键字
                    0 <= cabFile.indexOf("Filter") ||
                    0 <= cabFile.indexOf("List")
                ) {
                    this._logger = Logger.control;
                } else {
                    this._logger = Logger.component;
                }
            }
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
        return config;
    }
}

export default Etat;