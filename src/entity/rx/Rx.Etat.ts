import * as U from 'underscore';
import StateOut from '../state/StateOut';
import Ux from 'ux';
import {Taper} from 'environment';

class Etat {
    private _form: boolean = false;
    private readonly _cab: undefined;
    private _cabFile: undefined;
    private _logger: undefined;
    private _disableLog: Boolean = false;
    private _state: any = {};   // 初始状态有值，防止 null 异常
    private _loading: any;
    private _dispatchTo: any = {};
    private _stateTo: any;
    private _raft: any = {enabled: true};      // 默认打开 Raft模式
    private _op: {};
    private _isLog: boolean = true;

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
        if (null == logger) {
            this._disableLog = true;
        }
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

    raft(input) {
        /*
         * 开启 Raft 模式，只针对 Form 生效
         */
        const raftRef: any = this._raft;
        /*
         * 输入分流
         * 1）第一种调用 raft(n)，n为数值
         * 2）第二种直接配置 config
         *
         */
        if (U.isNumber(input)) {
            raftRef.columns = input;
        } else if (U.isObject(input)) {
            /*
             * 数据结构
             * {
             *     dynamic: {
             *         renders: {},
             *         extensions: {}
             *     },    // 动态渲染部分
             *     ...,            // 基本部分
             * }
             */
            if (input) {
                // null 也是 Object
                const {dynamic, ...jsx} = input;
                if (dynamic) {
                    raftRef.dynamic = dynamic;
                }
                raftRef.jsx = jsx;
            }
        }
        return this;
    }

    state(state) {
        this._state = state;
        return this;
    }

    ready(ready = false) {
        if (!this._state) this._state = {};
        this._state.$ready = ready;
        return this;
    }

    mock(mock) {
        if (mock) {
            if (!this._state) this._state = {};
            this._state["mock"] = mock;
        }
        return this;
    }

    loading(...loading) {
        // 特殊取法
        const args = [];
        if (1 < loading.length) {
            loading.forEach(each => args.push(each));
        } else if (1 === loading.length) {
            const input = loading[0];
            if (Array.isArray(input)) {
                input.forEach(each => args.push(each));
            } else {
                args.push(input);
            }
        }
        this._loading = Ux.ambiguityArray.apply(null, [].concat(args));
        return this;
    }

    // 默认State To Props
    connect(object, dispatch: boolean = false) {
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

    // rxTree: 树形专用
    tree(fnTree: any) {
        if (U.isFunction(fnTree)) {
            // RxTree专用
            this._dispatchTo.rxTree = fnTree;
        }
        return this;
    }

    // 按钮绑定专用
    bind(OP: any = {}) {
        if (!this._op) this._op = {};
        const opRef = this._op;
        Object.keys(OP)
        /* 过滤不存在的 key 信息 */
            .filter(key => !!key)
            .filter(key => "string" === typeof key)
            /* 过滤 key 不以 $op 开头 */
            .filter(key => key.startsWith("$op"))
            /* 过滤 value 不为 Function */
            .filter(key => U.isFunction(OP[key]))
            .map(key => opRef[key] = OP[key]);
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
        if (!this._disableLog) {
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
            // 判断 Function 的 op类型
            config.op = this._op;
        }
        return config;
    }
}

export default Etat;