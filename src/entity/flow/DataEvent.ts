import Ux from 'ux';

/*
 * data 是最终事件产生的数据源
 * type 是通过 data 分析过后的结果
 */
class DataEvent {
    private readonly data: any = [];
    private _response: any = [];
    private _previous: any;
    private _input: any;
    private _config: any;
    private _ref: any;
    /*
     * 定义信息
     */
    private _id: any;
    private _target: any;
    private _definition: any;

    constructor(data) {
        this.data = Ux.clone(data);
    }

    clone(definition) {
        /* 拷贝专用方法 */
        return new DataEvent(Ux.clone(this.data))
            .start(Ux.clone(this._input))
            .bind(this._ref)
            .metadata(definition)
            .config(this._config)
            .previous(Ux.clone(this._previous))
            .response(Ux.clone(this._response))
    }

    bind(ref: any) {
        if (ref) {
            this._ref = ref;
        }
        return this;
    }

    /*
     * 开始方法
     * previous = input
     */
    start(input) {
        this._input = input;
        this._previous = input;
        return this;
    }

    config(config) {
        this._config = config;
        Object.freeze(this._config);
        return this;
    }

    /*
     * 异步方法
     */
    next(response) {
        Ux.dgDebug(response, `[ ${this._id} ] ${this._response.length + 1}. 输出 --->`, `#969696`);
        this._previous = response;
        this._response.push(response);
        return Ux.promise(this);
    }

    end(finished) {
        this._previous = finished;
        this._response.push(finished);
        return this;
    }

    // ------------- 下边是取数据的方法 -------------
    getInput() {
        return this._input;
    }

    getName() {
        return this._id;
    }

    getTarget() {
        return this._target;
    }

    getRef() {
        // reference 处理
        return this._ref;
    }

    getData() {
        Ux.dgDebug(this._input, `[ ${this._id} ] ${this._response.length + 1}. ---> 输入`, `#6C7B8B`);
        return this.data;
    }

    getPrev() {
        return this._previous;
    }

    private previous(_previous) {
        this._previous = _previous;
        return this;
    }

    private response(_response) {
        this._response = _response;
        return this;
    }

    private metadata(definition) {
        Object.freeze(definition);
        this._id = definition.name;
        this._definition = definition;
        this._target = definition.target;
        return this;
    }
}

export default DataEvent