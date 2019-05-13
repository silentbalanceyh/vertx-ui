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
const obtainQuery = (container: any = {}, dataKey) => {
    let state = container.state ? container.state : {};
    let original = state["$query"];
    if (!original) original = {};
    if (dataKey) {
        original = original[dataKey];
        return Ux.clone(original);
    } else {
        console.warn("[Ox] 不可传入空的 dataKey，", original);
    }
};

class DataEvent {
    // 基础属性
    _name: any;
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
    // 状态和错误
    _state: any = {};
    _error: any = {};
    _stack: any = [];

    constructor(source: Object, target: any) {
        // 1. 验证事件本身规范
        if (verify(target)) {
            this._source = source;
            this._target = target;
            // 2. 抽取元数据
            // 事件名称
            this._name = target._name;
            this._control = target._target;
            // 事件配置
            this.config = target._config;
            // 获取根节点的引用信息
            this.container = target._reference;
            // 读取 this.container 中的状态（执行annexState链式修改）
            this._state = this.container.state;
        }
    }

    bind(Events: any): DataEvent {
        const name = this._name;
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
             * 还原状态而不是清空
             * 读取 this.container 中的状态（执行annexState链式修改）
             */
            this._state = this.container.state;
            /**
             * 清空错误
             */
            this._error = {};
        }
        return this;
    }

    stored(data: any): DataEvent {
        this.returns.push(data);
        return this;
    }

    error(error: any): DataEvent {
        if (0 === arguments.length) {
            return this._error;
        } else {
            this._error = error;
            return this;
        }
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

    name(): String {
        return this._name;
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
            console.error("[OXE] 事件规范冲突，无法生成事件提供者！", this._name, this.events);
            return () => false;
        }
    }

    isOk(): Boolean {
        return Ux.isEmpty(this._error);
    }

    next(): DataEvent {
        this.stored(this.getReturn());
        if (!Ux.isEmpty(this._error)) {
            this._error = {};
        }
        return this;
    }

    query(newQuery: any) {
        if (Ux.isEmpty(newQuery)) {
            this._target["_query"] = Ux.clone(newQuery);
        }
        return this;
    }

    /**
     * 返回当前 Event 对应的配置信息
     */
    getConfig() {
        return this.config ? this.config : {};
    }

    /**
     * 返回当前 Event 配置的规则
     */
    getRules() {
        return this.config.rules ? this.config.rules : {};
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
        // 读取远程容器中的数据
        const key = this._target._target;
        const query = obtainQuery(this.container, key);
        return query ? Ux.clone(query) : {};
    }

    // ----------------- 堆栈跳跃操作 --------------------
    stackPush(item: any): DataEvent {
        this._stack.push(item);
        return this;
    }

    stackPop() {
        if (0 < this._stack.length) {
            return this._stack.shift();
        } else return {};
    }

    stackPeek() {
        const length = this._stack.length;
        if (0 < length) {
            return this._stack[length - 1];
        } else return {};
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

    annexForm() {
        const {$reference} = this._source;
        const {form} = $reference.props;
        if (form) {
            return form;
        } else {
            console.error("[Ox-E] 对不起，您没使用Ant Design的Form封装该组件！");
        }
    }

    /**
     * 合并获取最新的 $query 的变量
     */
    annexQuery(query: any = {}) {
        const key = this._target._target;
        // 容器层读取数据
        return Ux.annexState(this._state, "$query", key, query);
    }

    /**
     * 合并获取最新的 $data 的变量
     */
    annexData(data: any = {}) {
        const key = this._target._dataKey;
        return Ux.annexState(this._state, "$data", key, data);
    }

    annexAssist(data: any = {}) {
        const assist = this.config.assist ? this.config.assist : {};
        const {ajax = ""} = assist;
        return Ux.annexState(this._state, "$data", ajax, data);
    }
}

export default DataEvent;