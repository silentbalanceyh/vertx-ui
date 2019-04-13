import * as U from 'underscore';
import Ux from 'ux';

const verify = (target: any = {}) => {
    const {_name} = target;
    if (!_name || !_name.startsWith("on")) {
        console.error("[OXE] 事件规范冲突，名称必须是 onXXX 格式！", _name);
        return false;
    }
    return true;
};

class DataEvent {
    // 基础属性
    name: any;
    _control: any;
    config: any = {};
    container;
    // 事件源和目标对象
    _source: any = {};
    _target: any = {};
    // 绑定好执行事件的函数
    events;
    // 执行期状态
    params: any = {};
    returns: any = [];
    _state: any = {};

    constructor(source: Object, target: any) {
        // 1. 验证事件本身规范
        if (verify(target)) {
            this._source = source;
            this._target = target;
            // 2. 抽取元数据
            // 事件名称
            this.name = target._name;
            this._control = target._target;
            // 事件配置
            this.config = target._config;
            // 获取根节点的引用信息
            this.container = target._reference;
        }
    }

    bind(Events: any): DataEvent {
        const name = this.name;
        if (Events.hasOwnProperty(name)) {
            const generator = Events[name];
            if (U.isFunction(generator)) {
                this.events = generator;
            } else {
                console.error("[OXE] 事件规范冲突，无法读取对应的生成器！", this.name);
            }
        }
        return this;
    }

    mount(params: any): DataEvent {
        if (params) {
            const input = Ux.clone(params);
            this.params = input;
            /**
             * 每次调用 mount 表示输入，所以此时会清空执行期队列
             * 执行期保留了每个 Behavior的返回值，
             * 为了防止 getParams 的调用，第一次mount的时候
             * 执行队列的第一个元素的值会被直接填充掉，后续在读取节点数据的时候就
             * 不用Start节点了，直接读取。
             */
            this.returns = [input];
            /**
             * 构造核心属性
             */
            this._source.$input = input;
            /**
             * 清空状态
             */
            this._state = {};
        }
        return this;
    }

    stored(data: any): DataEvent {
        this.returns.push(data);
        return this;
    }

    /**
     * 三义函数；
     * @param key
     * @param data
     */
    state(key: any, data: any): any {
        const argLength = arguments.length;
        if (0 === argLength) {
            return this._state;
        } else if (1 === argLength) {
            return this._state[key];
        } else {
            this._state[key] = data;
            Ux.dgDebug(this._state, `[Ox] 更新状态：${key}`, "#39c");
            return this;
        }
    }

    key(): String {
        return this.name;
    }

    control(): String {
        return this._control;
    }

    provider(): Function {
        if (this.events) {
            // 执行 generator
            const fnEvent = this.events(this);
            if (U.isFunction(fnEvent)) {
                return fnEvent;
            } else {
                console.error("[OXE] 函数本身不是一个高阶函数，执行过后无法生成函数！", fnEvent);
                return () => false;
            }
        } else {
            console.error("[OXE] 事件规范冲突，无法生成事件提供者！", this.name, this.events);
            return () => false;
        }
    }

    generate(params): Function {
        const fnGenerator = this._target._generator;
        if (U.isFunction(fnGenerator)) {
            return fnGenerator(params);
        } else {
            return () => Promise.resolve({error: "[OXE] Promise的生成器丢失！"});
        }
    }

    /**
     * 返回当前 Event 对应的配置信息
     */
    getConfig() {
        return this.config ? this.config : {};
    }

    // ----------------- 下边返回的内容都是副本 ----------------
    /**
     * 返回上一个Behavior的返回值，
     * 如果是第一个节点，这个函数的值就是参数 params 对应的信息
     */
    getReturn() {
        let index = this.returns.length - 1;
        if (0 > index) index = 0;
        const returnValue = this.returns[index];
        return returnValue ? Ux.clone(returnValue) : returnValue;
    }

    getQuery() {
        const query = this._target['_query'];
        return query ? Ux.clone(query) : {};
    }

    // ----------------- 下边方法是更新状态专用 -----------------

    annexSource() {
        return this._source;
    }

    annexTarget() {
        return this._target;
    }

    /**
     * 读取容器
     */
    annexContainer() {
        return this.container;
    }

    annexThis() {
        const {$reference} = this._source;
        return $reference ? $reference : {};
    }

    /**
     * 合并获取最新的 $query 的变量
     */
    annexQuery(query: any = {}) {
        const container = this.container;
        const key = this._target._target;
        return Ux.annexState(container, "$query", key, query);
    }

    /**
     * 合并获取最新的 $data 的变量
     */
    annexData(data: any = {}) {
        const container = this.container;
        const key = this._target._dataKey;
        return Ux.annexState(container, "$data", key, data);
    }
}

export default DataEvent;